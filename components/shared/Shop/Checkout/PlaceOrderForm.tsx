"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { createOrderAndHandlePayment } from "@/lib/actions/order.actions";
import { showErrorToast, showSuccessToast } from "@/lib/utils/showToastMessage";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

function PlaceOrderForm() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = async () => {
    startTransition(async () => {
      const res = await createOrderAndHandlePayment();

      if (!res?.success) {
        // ✅ اینجا یک پیام پیش‌فرض قرار می‌دهیم تا اگر سرور message نداد، توست خالی نشود
        showErrorToast(
          res?.message || "خطایی در ثبت سفارش رخ داد!",
          "top-right",
        );
        return;
      }

      if (res?.success) {
        showSuccessToast(res.message || "در حال انتقال...", "top-right");
        if (res.redirectTo) {
          router.push(res.redirectTo);
        }
      }
    });
  };

  return (
    <Button
      onClick={handleSubmit}
      disabled={isPending}
      className="w-full cursor-pointer rounded-full px-4 py-2 transition-all disabled:cursor-none"
    >
      {isPending ? (
        <Spinner className="ml-1 h-4 w-4" /> // ml-2 برای فاصله با متن
      ) : (
        <Check className="ml-1 h-4 w-4" />
      )}
      <span>ثبت نهایی سفارش</span>
    </Button>
  );
}

export default PlaceOrderForm;
