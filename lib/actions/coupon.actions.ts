"use server";

import { db } from "@/db";
import { carts, coupons } from "@/db/schema";
import { count, desc, eq, ilike } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { ActionResult } from "@/types";
import { getCurrentSession, requireAdmin } from "../auth/authGuard";
import { getMyCart } from "./cart.actions";
import { calculateCartPrice } from "../utils/calculateCartPrice";
import { validateCouponForUser } from "../services/coupon.service";
import {
  applyCouponSchema,
  createCouponSchema,
  updateCouponSchema,
} from "../validations/couponValidations";
import { formatError } from "../utils/formatError";

// =================================================================
// اعمال کد تخفیف روی سبد خرید کاربر جاری
// =================================================================
export async function applyCouponToCart(
  codeInput: string,
): Promise<ActionResult<string>> {
  try {
    const session = await getCurrentSession();
    if (!session?.user?.id) {
      return {
        success: false,
        error: { type: "custom", message: "لطفا ابتدا وارد حساب کاربری شوید" },
      };
    }

    const validated = applyCouponSchema.safeParse({ code: codeInput });
    if (!validated.success) {
      return {
        success: false,
        error: { type: "zod", issues: validated.error.issues },
      };
    }

    const cart = await getMyCart(session);
    if (!cart || (cart.items as unknown[]).length === 0) {
      return {
        success: false,
        error: { type: "custom", message: "سبد خرید شما خالی است" },
      };
    }

    const result = await validateCouponForUser(
      validated.data.code,
      session.user.id,
      cart.itemsPrice,
    );

    if (!result.valid) {
      return {
        success: false,
        error: { type: "custom", message: result.message },
      };
    }

    const prices = calculateCartPrice(cart.items as never, {
      type: result.coupon.type,
      value: result.coupon.value,
    });

    await db
      .update(carts)
      .set({
        couponCode: result.coupon.code,
        couponType: result.coupon.type,
        couponValue: result.coupon.value,
        ...prices,
      })
      .where(eq(carts.id, cart.id));

    revalidatePath("/shop/cart");
    revalidatePath("/shop/checkout/place-order");

    return {
      success: true,
      data: `کد تخفیف «${result.coupon.code}» با موفقیت اعمال شد`,
    };
  } catch (error) {
    return {
      success: false,
      error: { type: "custom", message: formatError(error) },
    };
  }
}

// =================================================================
// حذف کد تخفیف از سبد خرید
// =================================================================
export async function removeCouponFromCart(): Promise<ActionResult<string>> {
  try {
    const session = await getCurrentSession();
    if (!session?.user?.id) {
      return {
        success: false,
        error: { type: "custom", message: "لطفا ابتدا وارد حساب کاربری شوید" },
      };
    }

    const cart = await getMyCart(session);
    if (!cart) {
      return {
        success: false,
        error: { type: "custom", message: "سبد خرید یافت نشد" },
      };
    }

    const prices = calculateCartPrice(cart.items as never, null);

    await db
      .update(carts)
      .set({
        couponCode: null,
        couponType: null,
        couponValue: null,
        ...prices,
      })
      .where(eq(carts.id, cart.id));

    revalidatePath("/shop/cart");
    revalidatePath("/shop/checkout/place-order");

    return { success: true, data: "کد تخفیف حذف شد" };
  } catch (error) {
    return {
      success: false,
      error: { type: "custom", message: formatError(error) },
    };
  }
}

// =================================================================
// ADMIN: لیست کدهای تخفیف
// =================================================================
export async function getAllCoupons({
  limit = 10,
  page = 1,
  query,
}: {
  limit?: number;
  page?: number;
  query?: string;
}): Promise<
  ActionResult<{ couponsList: (typeof coupons.$inferSelect)[]; totalPages: number }>
> {
  try {
    await requireAdmin();

    const searchCondition = query ? ilike(coupons.code, `%${query}%`) : undefined;

    const couponsList = await db.query.coupons.findMany({
      where: searchCondition,
      orderBy: [desc(coupons.createdAt)],
      limit,
      offset: (page - 1) * limit,
    });

    const [countResult] = await db
      .select({ count: count() })
      .from(coupons)
      .where(searchCondition);

    return {
      success: true,
      data: {
        couponsList,
        totalPages: Math.ceil(countResult.count / limit),
      },
    };
  } catch (error) {
    return {
      success: false,
      error: { type: "custom", message: "خطا در دریافت لیست کدهای تخفیف" },
    };
  }
}

// =================================================================
// ADMIN: ساخت کد تخفیف جدید
// =================================================================
export async function createCoupon(
  data: unknown,
): Promise<ActionResult<string>> {
  try {
    await requireAdmin();

    const validated = createCouponSchema.safeParse(data);
    if (!validated.success) {
      return {
        success: false,
        error: { type: "zod", issues: validated.error.issues },
      };
    }

    const existing = await db.query.coupons.findFirst({
      where: eq(coupons.code, validated.data.code),
    });
    if (existing) {
      return {
        success: false,
        error: { type: "custom", message: "این کد تخفیف از قبل وجود دارد" },
      };
    }

    await db.insert(coupons).values(validated.data);
    revalidatePath("/admin/coupons");

    return { success: true, data: "کد تخفیف ایجاد شد" };
  } catch (error) {
    return {
      success: false,
      error: { type: "custom", message: formatError(error) },
    };
  }
}

// =================================================================
// ADMIN: ویرایش کد تخفیف
// =================================================================
export async function updateCoupon(
  id: string,
  data: unknown,
): Promise<ActionResult<string>> {
  try {
    await requireAdmin();

    const validated = updateCouponSchema.safeParse(data);
    if (!validated.success) {
      return {
        success: false,
        error: { type: "zod", issues: validated.error.issues },
      };
    }

    await db.update(coupons).set(validated.data).where(eq(coupons.id, id));
    revalidatePath("/admin/coupons");

    return { success: true, data: "کد تخفیف ویرایش شد" };
  } catch (error) {
    return {
      success: false,
      error: { type: "custom", message: formatError(error) },
    };
  }
}

// =================================================================
// ADMIN: حذف کد تخفیف
// =================================================================
export async function deleteCoupon(id: string): Promise<ActionResult<string>> {
  try {
    await requireAdmin();

    await db.delete(coupons).where(eq(coupons.id, id));
    revalidatePath("/admin/coupons");

    return { success: true, data: "کد تخفیف حذف شد" };
  } catch (error) {
    return {
      success: false,
      error: { type: "custom", message: formatError(error) },
    };
  }
}
