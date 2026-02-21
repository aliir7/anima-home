"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Check } from "lucide-react";

function PlaceOrderForm() {
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
