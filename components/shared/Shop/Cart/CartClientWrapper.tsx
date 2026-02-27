"use client";

import { useCartActions } from "@/hooks/useCartActions";
import { calculateCartPrice } from "@/lib/utils/calculateCartPrice"; // مسیر فایلی که تابع محاسبه در آن است را اصلاح کنید
import { Cart } from "@/types";
import CartItems from "./CartItems";
import CartSummary from "./CartSummary";
import EmptyCart from "./EmptyCart";

export default function CartClientWrapper({
  initialCart,
}: {
  initialCart: Cart;
}) {
  // ۱. ساخت استیت خوش‌بینانه فقط و فقط یک بار در سطح پدر
  const { optimisticCart, addToCart, removeFromCart } = useCartActions(
    initialCart.items,
  );

  // ۲. اگر سبد خرید خالی شد
  if (optimisticCart.length === 0) {
    return <EmptyCart />;
  }

  // ۳. محاسبه تمام قیمت‌ها بر اساس لیست آیتم‌های آپدیت شده در همان لحظه
  // (استفاده از همان تابعی که خودتان نوشتید)
  const prices = calculateCartPrice(optimisticCart);

  // ۴. ساختن آبجکت سبد خرید برای پاس دادن به CartSummary
  const optimisticCartObject: Cart = {
    ...initialCart, // آیدی سبد خرید و بقیه اطلاعات حفظ شود
    items: optimisticCart, // لیست جدید
    itemsPrice: prices.itemsPrice, // قیمت محاسبه شده جدید
    taxPrice: prices.taxPrice, // مالیات محاسبه شده جدید
    totalPrice: prices.totalPrice, // قیمت کل جدید
    // shippingPrice: initialCart.shippingPrice || 0, // هزینه ارسال
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      {/* لیست آیتم‌ها */}
      <div className="space-y-4 lg:col-span-8">
        {optimisticCart.map((item) => (
          <CartItems
            key={`${item.productId}-${item.variantId}`}
            item={item}
            addToCart={addToCart}
            removeFromCart={removeFromCart}
          />
        ))}
      </div>

      {/* صورت‌حساب لحظه‌ای */}
      <div className="lg:col-span-4">
        {/* وقتی روی + کلیک کنید، قیمت کل در CartSummary هم بدون مکث تغییر می‌کند */}
        <CartSummary cart={optimisticCartObject} />
      </div>
    </div>
  );
}
