"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  deliverOrder,
  updateOrderToPaidCOD,
} from "@/lib/actions/order.actions";
import {
  showErrorToast,
  showSuccessToast,
} from "@/lib/utils/showToastMessage";
import { CheckCircle2, Truck } from "lucide-react";

type OrderStatusActionsProps = {
  orderId: string;
  isPaid: boolean;
  isDelivered: boolean;
  isOnlinePayment: boolean;
};

export default function OrderStatusActions({
  orderId,
  isPaid,
  isDelivered,
  isOnlinePayment,
}: OrderStatusActionsProps) {
  const [isConfirmingPayment, startConfirmPayment] = useTransition();
  const [isMarkingDelivered, startMarkDelivered] = useTransition();

  const handleConfirmPayment = () => {
    startConfirmPayment(async () => {
      const res = await updateOrderToPaidCOD(orderId);

      if (!res.success) {
        showErrorToast(res.message ?? "خطا در تایید پرداخت", "top-right");
      } else {
        showSuccessToast(res.message ?? "پرداخت تایید شد", "top-right");
      }
    });
  };

  const handleMarkDelivered = () => {
    startMarkDelivered(async () => {
      const res = await deliverOrder(orderId);

      if (!res.success) {
        showErrorToast(res.message ?? "خطا در ثبت تحویل سفارش", "top-right");
      } else {
        showSuccessToast(res.message ?? "سفارش تحویل داده شد", "top-right");
      }
    });
  };

  // اگر هم پرداخت شده و هم تحویل داده شده، دیگر کاری برای ادمین نمانده
  if (isPaid && isDelivered) return null;

  return (
    <div className="flex flex-col gap-3 border-t pt-4">
      {/* برای پرداخت آنلاین (درگاه بانکی)، تایید پرداخت دستِ ادمین نیست —
          فقط verifyPayment بعد از تایید واقعی زیبال آن را انجام می‌دهد.
          این دکمه فقط برای کارت‌به‌کارت (که نیاز به تایید دستی ادمین دارد) نشان داده می‌شود. */}
      {!isPaid && !isOnlinePayment && (
        <Button
          onClick={handleConfirmPayment}
          disabled={isConfirmingPayment}
          className="w-full bg-green-600 text-white hover:bg-green-700"
        >
          {isConfirmingPayment ? (
            <Spinner className="ml-2 h-4 w-4" />
          ) : (
            <CheckCircle2 className="ml-2 h-4 w-4" />
          )}
          تایید دریافت پرداخت کارت‌به‌کارت
        </Button>
      )}

      {!isDelivered && (
        <Button
          onClick={handleMarkDelivered}
          disabled={isMarkingDelivered}
          variant="outline"
          className="w-full"
        >
          {isMarkingDelivered ? (
            <Spinner className="ml-2 h-4 w-4" />
          ) : (
            <Truck className="ml-2 h-4 w-4" />
          )}
          ثبت تحویل سفارش به مشتری
        </Button>
      )}
    </div>
  );
}
