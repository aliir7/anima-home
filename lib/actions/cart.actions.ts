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
// ADD ITEM TO CART ACTION
// =================================================================

export async function addItemToCart(
  data: CartItem,
): Promise<ActionResult<string>> {
  try {
    // Check for cart cookie
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;
    if (!sessionCartId) throw new Error("Cart session not found");

    // Get session and user ID
    const session = await auth();
    const userId = session?.user?.id ? (session.user.id as string) : undefined;

    // Get cart
    const cart = await getMyCart();

    // Parse and validate item
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

    // Find product in database
    const product = await db.query.products
      .findFirst({
        where: eq(products.id, item.productId!),
        with: {
          variants: true,
        },
      })

      .execute();

    if (!product) {
      throw new Error("Product not found");
    }
    if (!cart) {
      // Create new cart object
      const newCart = insertCartSchema.parse({
        userId: userId,
        items: [item],
        sessionCartId: sessionCartId,
        ...calculateCartPrice([item]),
      });

      // Add to database
      await db
        .insert(carts)
        .values({ ...newCart })
        .execute();

      revalidatePath(`/shop/products`);
      revalidatePath(`/shop/products/${product.seoSlug}`);

      return {
        success: true,
        data: `${product.title} به سبد خرید اضافه شد `,
      };
    }

    // if Cart existing
    else {
      // Check if item is already in cart
      const existItem = (cart.items as CartItem[]).find(
        (p) => p.productId === item.productId,
      );
      if (existItem) {
        // checking stock
        const notEnough = product.variants.find(
          (p) => p.stock < existItem.qty + 1,
        );

        if (notEnough) {
          throw new Error("موجودی کالا کافی نیست");
        }
        // Increase the quantity

        (cart.items as CartItem[]).find(
          (p) => p.productId === item.productId,
        )!.qty = existItem.qty + 1;
      } // If item does not exist in cart
      else {
        // checking stock
        const notEnough = product.variants.find((p) => p.stock < 1);
        if (notEnough) {
          throw new Error("موجودی کالا کافی نیست");
        }
        // Add item to the cart.items
        (cart.items as CartItem[]).push(item);
      }
      // Save to database
      await db
        .update(carts)
        .set({
          items: cart.items,
          ...calculateCartPrice(cart.items as CartItem[]),
        })
        .where(eq(carts.id, cart.id)); // <<<<< این خط حیاتی اضافه شد

      revalidatePath(`/shop/products`);
      revalidatePath(`/shop/products/${product.seoSlug}`);

      return {
        success: true,
        data: `${product.title}${existItem ? "بروزرسانی شد  در" : "اضافه شد  به "}سبد خرید`,
      };
    }
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
// REMOVE ITEM FROM CART ACTION
// =================================================================

export async function removeItemFromCart(
  productId: string,
  removeAll: boolean = false,
): Promise<ActionResult<string>> {
  try {
    // Check for cart cookie
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;
    if (!sessionCartId) throw new Error("Cart session not found");

    // Find product in database
    const product = await db.query.products
      .findFirst({
        where: eq(products.id, productId),
        with: {
          variants: true,
        },
      })
      .execute();

    if (!product) {
      throw new Error("محصول یافت نشد");
    }
    // Get user cart
    const cart = await getMyCart();
    if (!cart) throw new Error("سبد خرید یافت نشد");

    // Check for item
    const exist = (cart.items as CartItem[]).find(
      (p) => p.productId === productId,
    );

    if (!exist) {
      throw new Error("آیتمی در سبد خرید یافت نشد");
    }

    // Check if only one in qty
    if (exist.qty === 1 || removeAll) {
      // Remove from cart
      cart.items = (cart.items as CartItem[]).filter(
        (p) => p.productId !== exist.productId,
      );
    } else {
      // Decrease qty
      (cart.items as CartItem[]).find((p) => p.productId === productId)!.qty =
        exist.qty - 1;
    }

    // Update cart in database
    // ... در انتهای تابع
    await db
      .update(carts)
      .set({
        items: cart.items,
        ...calculateCartPrice(cart.items as CartItem[]),
      })
      .where(eq(carts.id, cart.id)); // <<<<< این خط حیاتی اضافه شد

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
