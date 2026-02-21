import { cn } from "@/lib/utils/utils";

type CheckoutStepsProps = {
  current: 1 | 2 | 3;
};

const steps = [
  { id: 1, title: "ثبت آدرس" },
  { id: 2, title: "انتخاب روش پرداخت" },
  { id: 3, title: "ثبت سفارش" },
];

function CheckoutSteps({ current }: CheckoutStepsProps) {
  return (
    <div className="mb-8 flex justify-center">
      <div className="flex items-center gap-6">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center gap-3">
            {/* Step Circle */}
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full border text-sm font-medium",
                step.id <= current
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-muted text-muted-foreground",
              )}
            >
              {step.id}
            </div>

            {/* Title */}
            <span
              className={cn(
                "text-sm",
                step.id <= current
                  ? "text-foreground font-medium"
                  : "text-muted-foreground",
              )}
            >
              {step.title}
            </span>

            {/* Divider */}
            {index < steps.length - 1 && <div className="bg-border h-px w-8" />}
          </div>
        ))}
      </div>
    </div>
  );
}

export default CheckoutSteps;
