"use server";

import { db } from "@/db";
import { carts, products } from "@/db/schema";
import { ActionResult, CartItem } from "@/types";
import { and, eq, isNull } from "drizzle-orm";
import { Session } from "next-auth";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { auth } from "../auth";
import { calculateCartPrice } from "../utils/calculateCartPrice";
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
 * Session کاربر جاری را برمی‌گرداند.
 *
 * فقط همین Helper باید auth() را صدا بزند.
 */
async function getCurrentSession() {
  return auth();
}

/**
 * به‌روزرسانی سبد خرید
 *
 * مسئولیت‌ها:
 * 1- محاسبه مجدد قیمت‌ها
 * 2- ذخیره در دیتابیس
 * 3- Revalidate صفحات فروشگاه
 */
async function updateCart(
  cartId: string,
  items: CartItem[],
  paths: string[] = [],
) {
  await db
    .update(carts)
    .set({
      items,
      ...calculateCartPrice(items),
    })
    .where(eq(carts.id, cartId));

  revalidatePath("/shop/products");

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

    await updateCart(cart.id, items);

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

    await updateCart(cart.id, updatedItems, [
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
