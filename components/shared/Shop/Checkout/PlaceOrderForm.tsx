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
  const handleSubmit = () => {
    startTransition(async () => {
      const res = await createOrderAndHandlePayment();
      if (!res?.success) {
        showErrorToast(res?.message!, "top-right");
        return;
      }

      if (res?.success) {
        showSuccessToast(res.message!, "top-right");
        const redirect = res.redirectTo;
        router.push(redirect!);
      }
    });
  };

  return (
    <Button onClick={handleSubmit} disabled={isPending} className="w-full">
      {isPending ? (
        <Spinner className="h-4 w-4" />
      ) : (
        <Check className="h-4 w-4" />
      )}
      <span className="mr-2">ثبت نهایی سفارش</span>
    </Button>
  );
}

export default PlaceOrderForm;
