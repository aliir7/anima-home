"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { createPayment } from "@/lib/actions/payment.actions"; // آدرس اکشن زیبال خود را چک کنید
import { CreditCard } from "lucide-react";
import { useRouter } from "next/navigation";
import { showErrorToast } from "@/lib/utils/showToastMessage";
import { formatError } from "@/lib/utils/formatError";
import { Spinner } from "@/components/ui/spinner";
import formatPrice from "@/lib/utils/formatPrice";

type RetryPaymentButtonProps = {
  orderId: string;
  amount?: number;
};

export default function RetryPaymentButton({
  orderId,
  amount,
}: RetryPaymentButtonProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handlePayment = async () => {
    startTransition(async () => {
      try {
        // فراخوانی اکشن ساخت لینک درگاه
        const res = await createPayment(orderId);

        if (res.url) {
          // انتقال کاربر به درگاه زیبال
          router.push(res.url);
        } else {
          showErrorToast(
            "خطا در ارتباط با درگاه بانکی. لطفا مجددا تلاش کنید.",
            "top-right",
            res.message,
          );
        }
      } catch (error) {
        showErrorToast("خطایی رخ داد.", "top-right", formatError(error));
      }
    });
  };

  return (
    <Button
      onClick={handlePayment}
      disabled={isPending}
      className="w-full bg-green-600 text-white hover:bg-green-700 sm:w-auto"
    >
      {isPending ? (
        <Spinner className="ml-2 h-4 w-4" />
      ) : (
        <CreditCard className="ml-2 h-4 w-4" />
      )}
      پرداخت آنلاین ({formatPrice(amount!)} تومان)
    </Button>
  );
}
