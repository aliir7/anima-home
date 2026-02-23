import { cn } from "@/lib/utils/utils";
import Link from "next/link";
import React from "react";

type CheckoutStepsProps = {
  current: 1 | 2 | 3;
};

// تعریف لینک‌ها برای هر مرحله
const steps = [
  { id: 1, title: "ثبت آدرس", link: "/shop/checkout/shipping-address" },
  { id: 2, title: "انتخاب روش پرداخت", link: "/shop/checkout/payment-method" },
  { id: 3, title: "ثبت سفارش", link: "/shop/checkout/place-order" },
];

function CheckoutSteps({ current }: CheckoutStepsProps) {
  return (
    <div className="mb-8 flex w-full justify-center px-4">
      <div className="flex items-center gap-2 sm:gap-4 md:gap-6">
        {steps.map((step, index) => {
          // فقط مراحل قبلی و مرحله جاری قابل کلیک باشند
          const isClickable = step.id <= current;

          return (
            <React.Fragment key={step.id}>
              <Link
                href={isClickable ? step.link : "#"}
                className={cn(
                  "flex items-center gap-2 transition-opacity md:gap-3",
                  // اگر مرحله آینده است، موس غیرفعال شود و کمی کمرنگ شود
                  !isClickable && "pointer-events-none opacity-60",
                )}
                // جلوگیری از رفتار پیش‌فرض لینک اگر مرحله غیرفعال است
                aria-disabled={!isClickable}
              >
                {/* Step Circle */}
                <div
                  className={cn(
                    // shrink-0 باعث می‌شود دایره هرگز له نشود
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm font-medium transition-colors",
                    step.id <= current
                      ? "bg-primary text-primary-foreground border-primary dark:border-primaryDark dark:bg-muted dark:text-muted-foreground"
                      : "bg-muted text-muted-foreground dark:bg-primary dark:text-primary-foreground",
                  )}
                >
                  {step.id}
                </div>

                {/* Title */}
                {/* در موبایل متن را مخفی می‌کنیم تا جا برای دایره‌ها باز شود (hidden sm:block) */}
                <span
                  className={cn(
                    "hidden text-xs whitespace-nowrap sm:block sm:text-sm",
                    step.id <= current
                      ? "text-foreground font-medium dark:text-neutral-600"
                      : "text-muted-foreground dark:text-neutral-600",
                  )}
                >
                  {step.title}
                </span>
              </Link>

              {/* Divider */}
              {index < steps.length - 1 && (
                // خط اتصال هم در موبایل کمی کوتاه‌تر می‌شود
                <div className="bg-border dark:bg-muted-foreground h-px w-6 sm:w-12 md:w-16" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

export default CheckoutSteps;
