"use server";

import { db } from "@/db";
import { carts, products, coupons } from "@/db/schema";
import { ActionResult, CartItem } from "@/types";
import { and, eq, isNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import type { Session } from "../auth";
import { getCurrentSession } from "../auth/authGuard";
import {
  calculateCartPrice,
  AppliedCoupon,
} from "../utils/calculateCartPrice";
import { formatError } from "../utils/formatError";
import {
  cartItemSchema,
  insertCartSchema,
} from "../validations/cartValidations";
import { findProductWithVariants } from "./product.actions";

/* -------------------------------------------------------------------------- */
/*                               Private Helpers                              */
/* -------------------------------------------------------------------------- */

/**
 * شناسه سبد خرید مهمان را از Cookie دریافت می‌کند.
 */
async function getSessionCartId() {
  return (await cookies()).get("sessionCartId")?.value;
}

/**
 * به‌روزرسانی سبد خرید
 *
 * مسئولیت‌ها:
 * 1- محاسبه مجدد قیمت‌ها (با در نظر گرفتن کد تخفیف فعلی، اگر باشد)
 * 2- اگر کوپن فعلی دیگر واجد شرایط نبود (مثلاً حداقل مبلغ سفارش)، خودکار حذفش می‌کند
 * 3- ذخیره در دیتابیس
 * 4- Revalidate صفحات فروشگاه
 */
async function updateCart(
  cart: NonNullable<Awaited<ReturnType<typeof getMyCart>>>,
  items: CartItem[],
  paths: string[] = [],
) {
  let coupon: AppliedCoupon = null;
  let couponCode = cart.couponCode ?? null;
  let couponType = cart.couponType ?? null;
  let couponValue = cart.couponValue ?? null;

  if (couponCode && couponType && couponValue != null) {
    const newItemsPrice = items.reduce(
      (acc, item) => acc + Number(item.price) * item.qty,
      0,
    );

    // چک سبک اینکه آیا کوپن هنوز فعال است و حداقل مبلغ سفارش را دارد
    const couponRow = await db.query.coupons.findFirst({
      where: eq(coupons.code, couponCode),
      columns: { minOrderAmount: true, isActive: true },
    });

    const stillQualifies =
      !!couponRow?.isActive &&
      (couponRow.minOrderAmount == null ||
        newItemsPrice >= couponRow.minOrderAmount);

    if (stillQualifies) {
      coupon = { type: couponType, value: couponValue };
    } else {
      // دیگر واجد شرایط نیست — کوپن را خودکار از سبد حذف می‌کنیم
      couponCode = null;
      couponType = null;
      couponValue = null;
    }
  }

  const prices = calculateCartPrice(items, coupon);

  await db
    .update(carts)
    .set({
      items,
      ...prices,
      couponCode,
      couponType,
      couponValue,
    })
    .where(eq(carts.id, cart.id));

  revalidatePath("/shop/products");
  revalidatePath("/shop/cart");

  for (const path of paths) {
    revalidatePath(path);
  }
}

// =================================================================
// ADD ITEM TO CART
// =================================================================

export async function addItemToCart(
  data: CartItem,
): Promise<ActionResult<string>> {
  try {
    /* -------------------------------------------------------------------------- */
    /*                               1. Validate Input                            */
    /* -------------------------------------------------------------------------- */

    const validation = cartItemSchema.safeParse(data);

    if (!validation.success) {
      return {
        success: false,
        error: {
          type: "zod",
          issues: validation.error.issues,
        },
      };
    }

    const item = validation.data;

    /* -------------------------------------------------------------------------- */
    /*                              2. Find Product                               */
    /* -------------------------------------------------------------------------- */

    const product = await findProductWithVariants(item.productId!);
    if (!product) {
      throw new Error("محصول یافت نشد.");
    }

    if (!product.variants.length) {
      throw new Error("این محصول هیچ واریانتی ندارد.");
    }

    /* -------------------------------------------------------------------------- */
    /*                             3. Select Variant                              */
    /* -------------------------------------------------------------------------- */

    const selectedVariant = item.variantId
      ? product.variants.find((variant) => variant.id === item.variantId)
      : product.variants[0];

    if (!selectedVariant) {
      throw new Error("واریانت انتخاب شده یافت نشد.");
    }

    // اگر Variant ارسال نشده بود
    // اولین Variant را به عنوان پیش‌فرض ثبت می‌کنیم.
    item.variantId ??= selectedVariant.id;

    // Snapshot قیمت در زمان افزودن به سبد
    item.price = selectedVariant.price;

    /* -------------------------------------------------------------------------- */
    /*                       4. Get Current Cart & Session                         */
    /* -------------------------------------------------------------------------- */

    const session = await getCurrentSession();

    const sessionCartId = await getSessionCartId();

    if (!session?.user?.id && !sessionCartId) {
      throw new Error("شناسه سبد خرید یافت نشد.");
    }

    const cart = await getMyCart(session);

    /* -------------------------------------------------------------------------- */
    /*                          5. Create New Cart                                */
    /* -------------------------------------------------------------------------- */

    if (!cart) {
      if (selectedVariant.stock < item.qty) {
        throw new Error("موجودی کالا کافی نیست.");
      }

      const newCart = insertCartSchema.parse({
        userId: session?.user?.id,
        sessionCartId,
        items: [item],
        ...calculateCartPrice([item]),
      });

      await db.insert(carts).values(newCart);

      revalidatePath("/shop/products");

      return {
        success: true,
        data: `${product.title} به سبد خرید اضافه شد.`,
      };
    }

    /* -------------------------------------------------------------------------- */
    /*                           6. Update Existing Cart                          */
    /* -------------------------------------------------------------------------- */

    const items = [...(cart.items as CartItem[])];

    const itemIndex = items.findIndex(
      (cartItem) =>
        cartItem.productId === item.productId &&
        cartItem.variantId === item.variantId,
    );

    if (itemIndex >= 0) {
      const currentItem = items[itemIndex];

      if (selectedVariant.stock < currentItem.qty + 1) {
        throw new Error("موجودی کالا کافی نیست.");
      }

      items[itemIndex] = {
        ...currentItem,
        qty: currentItem.qty + 1,
      };
    } else {
      if (selectedVariant.stock < item.qty) {
        throw new Error("موجودی کالا کافی نیست.");
      }

      items.push(item);
    }

    /* -------------------------------------------------------------------------- */
    /*                               7. Save Cart                                 */
    /* -------------------------------------------------------------------------- */

    await updateCart(cart, items);

    return {
      success: true,
      data: `${product.title} ${
        itemIndex >= 0 ? "بروزرسانی شد." : "به سبد خرید اضافه شد."
      }`,
    };
  } catch (err) {
    return {
      success: false,
      error: {
        type: "custom",
        message: formatError(err),
      },
    };
  }
}

// =================================================================
// REMOVE ITEM FROM CART
// =================================================================

export async function removeItemFromCart(
  productId: string,
  variantId: string,
  removeAll = false,
): Promise<ActionResult<string>> {
  try {
    /* -------------------------------------------------------------------------- */
    /*                              1. Find Product                               */
    /* -------------------------------------------------------------------------- */

    const product = await db.query.products.findFirst({
      where: eq(products.id, productId),
    });

    if (!product) {
      throw new Error("محصول یافت نشد.");
    }

    /* -------------------------------------------------------------------------- */
    /*                           2. Get Current Cart                              */
    /* -------------------------------------------------------------------------- */

    const session = await getCurrentSession();

    const cart = await getMyCart(session);

    if (!cart) {
      throw new Error("سبد خرید یافت نشد.");
    }

    const items = [...(cart.items as CartItem[])];

    /* -------------------------------------------------------------------------- */
    /*                             3. Find Cart Item                              */
    /* -------------------------------------------------------------------------- */

    const itemIndex = items.findIndex(
      (item) => item.productId === productId && item.variantId === variantId,
    );

    if (itemIndex === -1) {
      throw new Error("آیتم مورد نظر در سبد خرید وجود ندارد.");
    }

    const currentItem = items[itemIndex];

    /* -------------------------------------------------------------------------- */
    /*                             4. Update Items                                */
    /* -------------------------------------------------------------------------- */

    let updatedItems: CartItem[];

    // حذف کامل آیتم
    if (removeAll || currentItem.qty === 1) {
      updatedItems = items.filter((_, index) => index !== itemIndex);
    } else {
      // فقط کاهش تعداد
      updatedItems = items.map((item, index) =>
        index === itemIndex
          ? {
              ...item,
              qty: item.qty - 1,
            }
          : item,
      );
    }

    /* -------------------------------------------------------------------------- */
    /*                              5. Save Changes                               */
    /* -------------------------------------------------------------------------- */

    await updateCart(cart, updatedItems, [
      `/shop/products/${product.seoSlug}`,
    ]);

    return {
      success: true,
      data: `${product.title} از سبد خرید حذف شد.`,
    };
  } catch (err) {
    return {
      success: false,
      error: {
        type: "custom",
        message: formatError(err),
      },
    };
  }
}
// =================================================================
// GET MY CART ACTION (نسخه اصلاح شده)
// =================================================================

/**
 * دریافت سبد خرید کاربر جاری
 *
 * سناریوها:
 *
 * 1- اگر کاربر لاگین کرده باشد
 *    => جستجو بر اساس userId
 *
 * 2- اگر کاربر مهمان باشد
 *    => جستجو بر اساس sessionCartId
 *
 * نکته:
 * Merge سبد مهمان هنگام Login انجام می‌شود،
 * بنابراین این تابع فقط مسئول خواندن سبد خرید است.
 */
export async function getMyCart(session?: Session | null) {
  const sessionCartId = await getSessionCartId();

  if (!session?.user?.id && !sessionCartId) {
    return undefined;
  }

  return db.query.carts.findFirst({
    where: session?.user?.id
      ? eq(carts.userId, session.user.id)
      : and(eq(carts.sessionCartId, sessionCartId!), isNull(carts.userId)),
  });
}

/**
 * تعداد آیتم‌های موجود در سبد خرید
 *
 * مناسب برای:
 * - Header
 * - Navbar
 * - Badge
 */
export async function getCartItemsCount(session?: Session | null) {
  const cart = await getMyCart(session);

  return Array.isArray(cart?.items) ? (cart.items as CartItem[]).length : 0;
}
