import { CartItem } from "@/types";

export type AppliedCoupon = {
  type: "percent" | "fixed";
  value: number;
} | null;

/**
 * محاسبه‌ی مبلغ تخفیف بر اساس نوع کوپن. همیشه از این تابع استفاده کنید
 * (هم برای نمایش optimistic سمت کلاینت، هم موقع ذخیره‌سازی سمت سرور) تا
 * محاسبه‌ی تخفیف همیشه با itemsPrice فعلی هم‌خوان و به‌روز بماند —
 * مخصوصاً برای کوپن‌های درصدی که با تغییر سبد، مبلغ تخفیف هم باید تغییر کند.
 */
export function calculateDiscountAmount(
  coupon: AppliedCoupon,
  itemsPrice: number,
): number {
  if (!coupon) return 0;

  if (coupon.type === "percent") {
    return Math.round((itemsPrice * coupon.value) / 100);
  }

  // fixed: تخفیف هرگز نمی‌تواند بیشتر از مبلغ کالاها باشد
  return Math.min(coupon.value, itemsPrice);
}

export function calculateCartPrice(items: CartItem[], coupon?: AppliedCoupon) {
  const itemsPrice = items.reduce(
    (acc, item) => acc + Number(item.price) * item.qty,
    0,
  );

  const taxPrice = 0 * itemsPrice;
  const discountAmount = calculateDiscountAmount(coupon ?? null, itemsPrice);
  const totalPrice = Math.max(0, itemsPrice + taxPrice - discountAmount);

  return {
    itemsPrice,
    taxPrice,
    discountAmount,
    totalPrice,
  };
}
