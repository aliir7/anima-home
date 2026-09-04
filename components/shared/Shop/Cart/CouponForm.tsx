"use client";

import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { X, Tag } from "lucide-react";
import {
  applyCouponToCart,
  removeCouponFromCart,
} from "@/lib/actions/coupon.actions";
import {
  showErrorToast,
  showSuccessToast,
} from "@/lib/utils/showToastMessage";

type CouponFormProps = {
  appliedCode?: string | null;
};

export default function CouponForm({ appliedCode }: CouponFormProps) {
  const [code, setCode] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleApply = () => {
    if (!code.trim()) return;

    startTransition(async () => {
      const res = await applyCouponToCart(code);

      if (!res.success) {
        showErrorToast(
          res.error.type === "custom" ? res.error.message : "کد نامعتبر است",
          "top-right",
        );
      } else {
        showSuccessToast(res.data ?? "کد تخفیف اعمال شد", "top-right");
        setCode("");
      }
    });
  };

  const handleRemove = () => {
    startTransition(async () => {
      const res = await removeCouponFromCart();
      if (!res.success) {
        showErrorToast(
          res.error.type === "custom" ? res.error.message : "خطا رخ داد",
          "top-right",
        );
      } else {
        showSuccessToast(res.data ?? "کد تخفیف حذف شد", "top-right");
      }
    });
  };

  if (appliedCode) {
    return (
      <div className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm dark:border-green-900 dark:bg-green-950">
        <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
          <Tag className="h-4 w-4" />
          <span className="font-medium">{appliedCode}</span>
        </div>
        <button
          onClick={handleRemove}
          disabled={isPending}
          className="text-muted-foreground hover:text-destructive cursor-pointer"
          aria-label="حذف کد تخفیف"
        >
          {isPending ? <Spinner width={4} height={4} /> : <X className="h-4 w-4" />}
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Input
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="کد تخفیف"
        className="h-9"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleApply();
          }
        }}
      />
      <Button
        size="sm"
        variant="outline"
        onClick={handleApply}
        disabled={isPending || !code.trim()}
        className="shrink-0 rounded-full"
      >
        {isPending ? <Spinner width={4} height={4} /> : "اعمال"}
      </Button>
    </div>
  );
}
