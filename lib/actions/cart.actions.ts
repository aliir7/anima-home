"use server";

import { ActionResult, CartItem } from "@/types";
import { cookies } from "next/headers";
import { auth } from "../auth";
import { formatError } from "../utils/formatError";
import { db } from "@/db";
import { and, eq, isNull } from "drizzle-orm";
import { carts, products } from "@/db/schema";
import {
  cartItemSchema,
  insertCartSchema,
} from "../validations/cartValidations";
import { calculateCartPrice } from "../utils/calculateCartPrice";
import { revalidatePath } from "next/cache";

// =================================================================
// ADD ITEM TO CART ACTION (FIXED)
// =================================================================

export async function addItemToCart(
  data: CartItem,
): Promise<ActionResult<string>> {
  try {
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;
    if (!sessionCartId) throw new Error("Cart session not found");

    const session = await auth();
    const userId = session?.user?.id ? (session.user.id as string) : undefined;

    const cart = await getMyCart();

    const validation = cartItemSchema.safeParse(data);
    if (!validation.success) {
      return {
        success: false,
        error: { type: "zod", issues: validation.error.issues },
      };
    }

    const item = validation.data;

    // 1. پیدا کردن محصول و واریانت‌ها
    const product = await db.query.products
      .findFirst({
        where: eq(products.id, item.productId!),
        with: { variants: true },
      })
      .execute();

    if (!product || !product.variants || product.variants.length === 0) {
      throw new Error("Product not found or has no variants");
    }

    // ✅ اصلاح ۱: اطمینان از وجود variantId
    // اگر variantId فرستاده نشده، اولین واریانت محصول را به عنوان پیش‌فرض انتخاب می‌کنیم
    let selectedVariant;
    if (item.variantId) {
      selectedVariant = product.variants.find((v) => v.id === item.variantId);
    } else {
      selectedVariant = product.variants[0];
      // آی‌دی واریانت پیدا شده را به آیتم تزریق می‌کنیم تا در سبد خرید نال نباشد
      item.variantId = selectedVariant.id;
      // اختیاری: قیمت را هم از واریانت بگیرید تا دقیق باشد
      item.price = selectedVariant.price;
    }

    if (!selectedVariant) {
      throw new Error("واریانت مورد نظر یافت نشد");
    }

    // ساخت سبد خرید جدید (اگر وجود نداشت)
    if (!cart) {
      // چک کردن موجودی
      if (selectedVariant.stock < item.qty) {
        throw new Error("موجودی کالا کافی نیست");
      }

      const newCart = insertCartSchema.parse({
        userId: userId,
        items: [item], // الان item حتما variantId دارد
        sessionCartId: sessionCartId,
        ...calculateCartPrice([item]),
      });

      await db
        .insert(carts)
        .values({ ...newCart })
        .execute();

      revalidatePath(`/shop/products`);
      return { success: true, data: `${product.title} به سبد خرید اضافه شد` };
    }

    // اگر سبد خرید وجود داشت
    else {
      // ✅ اصلاح ۲: چک کردن دقیق (هم محصول و هم واریانت باید یکی باشند)
      const existItem = (cart.items as CartItem[]).find(
        (p) => p.productId === item.productId && p.variantId === item.variantId,
      );

      if (existItem) {
        // ✅ اصلاح ۳: چک کردن موجودی فقط برای همان واریانت خاص
        if (selectedVariant.stock < existItem.qty + 1) {
          throw new Error("موجودی کالا کافی نیست");
        }

        // افزایش تعداد
        existItem.qty += 1;
      } else {
        // آیتم جدید است
        if (selectedVariant.stock < 1) {
          throw new Error("موجودی کالا کافی نیست");
        }
        (cart.items as CartItem[]).push(item);
      }

      // ذخیره در دیتابیس
      await db
        .update(carts)
        .set({
          items: cart.items,
          ...calculateCartPrice(cart.items as CartItem[]),
        })
        .where(eq(carts.id, cart.id));

      revalidatePath(`/shop/products`);
      return {
        success: true,
        data: `${product.title} ${existItem ? "بروزرسانی شد" : "اضافه شد"}`,
      };
    }
  } catch (err) {
    return {
      success: false,
      error: { type: "custom", message: formatError(err) },
    };
  }
}

// =================================================================
// REMOVE ITEM FROM CART ACTION (FIXED)
// =================================================================

// تغییر ۱: اضافه شدن variantId به ورودی تابع
export async function removeItemFromCart(
  productId: string,
  variantId: string,
  removeAll: boolean = false,
): Promise<ActionResult<string>> {
  try {
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;
    if (!sessionCartId) throw new Error("Cart session not found");

    // گرفتن اطلاعات محصول (فقط برای نمایش اسم در پیام موفقیت)
    const product = await db.query.products
      .findFirst({
        where: eq(products.id, productId),
      })
      .execute();

    if (!product) throw new Error("محصول یافت نشد");

    const cart = await getMyCart();
    if (!cart) throw new Error("سبد خرید یافت نشد");

    // تغییر ۲: پیدا کردن دقیق آیتم با ترکیب محصول و واریانت
    const existIndex = (cart.items as CartItem[]).findIndex(
      (p) => p.productId === productId && p.variantId === variantId,
    );

    if (existIndex === -1) {
      throw new Error("آیتمی در سبد خرید یافت نشد");
    }

    const exist = (cart.items as CartItem[])[existIndex];

    // تغییر ۳: منطق حذف کردن
    if (exist.qty === 1 || removeAll) {
      // حذف کامل آیتم از آرایه
      (cart.items as CartItem[]).splice(existIndex, 1);
    } else {
      // کاهش تعداد
      (cart.items as CartItem[])[existIndex].qty = exist.qty - 1;
    }

    // آپدیت دیتابیس
    await db
      .update(carts)
      .set({
        items: cart.items,
        ...calculateCartPrice(cart.items as CartItem[]),
      })
      .where(eq(carts.id, cart.id));

    revalidatePath(`/shop/products`);
    revalidatePath(`/shop/products/${product.seoSlug}`);

    return {
      success: true,
      data: `${product.title} از سبد خرید حذف شد`,
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

export async function getMyCart() {
  const sessionCartId = (await cookies()).get("sessionCartId")?.value;
  // اگر کوکی وجود نداشت، سبدی هم وجود ندارد
  if (!sessionCartId) return undefined;

  const session = await auth();
  const userId = session?.user?.id;

  // شرط جستجوی بهینه:
  // 1. اگر کاربر لاگین کرده: سبدی را پیدا کن که userId آن متعلق به این کاربر است.
  // 2. اگر کاربر مهمان است: سبدی را پیدا کن که sessionCartId آن با کوکی یکی است و userId ندارد.
  const cart = await db.query.carts.findFirst({
    where: userId
      ? eq(carts.userId, userId)
      : and(eq(carts.sessionCartId, sessionCartId), isNull(carts.userId)),
  });

  if (!cart) {
    // حالت دیگر: شاید سبد برای کاربر مهمان بوده و حالا لاگین کرده.
    // در این حالت، باید سبد مهمان را پیدا کنیم و userId را به آن متصل کنیم.
    // این منطق پیچیده‌تر است و معمولا در زمان لاگین انجام می‌شود (merge cart).
    // برای سادگی، فعلا فقط سبد مهمان را برمی‌گردانیم اگر سبد کاربری نبود.
    const guestCart = await db.query.carts.findFirst({
      where: eq(carts.sessionCartId, sessionCartId),
    });
    return guestCart;
  }

  return cart;
}
