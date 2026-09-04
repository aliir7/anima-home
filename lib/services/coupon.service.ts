//
// این فایل عمداً "use server" ندارد. validateCouponForUser یک userId
// می‌گیرد و اگر داخل یک فایل "use server" export می‌شد، خودش هم یک
// Server Action مستقل می‌شد که هرکسی می‌توانست با userId دلخواه صدایش
// بزند — دقیقاً همان الگوی IDOR که در فاز امنیتی این پروژه چندین بار
// در جاهای دیگر رفع شد.

import { db } from "@/db";
import { coupons, couponUsages } from "@/db/schema";
import { and, count, eq } from "drizzle-orm";

export async function validateCouponForUser(
  code: string,
  userId: string,
  itemsPrice: number,
): Promise<
  | { valid: true; coupon: typeof coupons.$inferSelect }
  | { valid: false; message: string }
> {
  const coupon = await db.query.coupons.findFirst({
    where: eq(coupons.code, code.trim().toUpperCase()),
  });

  if (!coupon || !coupon.isActive) {
    return { valid: false, message: "کد تخفیف نامعتبر است" };
  }

  if (coupon.expiresAt && coupon.expiresAt.getTime() < Date.now()) {
    return { valid: false, message: "این کد تخفیف منقضی شده است" };
  }

  if (coupon.minOrderAmount != null && itemsPrice < coupon.minOrderAmount) {
    return {
      valid: false,
      message: `این کد فقط برای سفارش‌های بالای ${coupon.minOrderAmount.toLocaleString("fa-IR")} تومان قابل استفاده است`,
    };
  }

  if (coupon.maxUses != null && coupon.usedCount >= coupon.maxUses) {
    return { valid: false, message: "ظرفیت استفاده از این کد تمام شده است" };
  }

  if (coupon.maxUsesPerUser != null) {
    const [userUsage] = await db
      .select({ count: count() })
      .from(couponUsages)
      .where(
        and(
          eq(couponUsages.couponId, coupon.id),
          eq(couponUsages.userId, userId),
        ),
      );

    if (userUsage.count >= coupon.maxUsesPerUser) {
      return {
        valid: false,
        message: "شما قبلاً از این کد تخفیف استفاده کرده‌اید",
      };
    }
  }

  return { valid: true, coupon };
}
