import { Check } from "lucide-react";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils/utils";
import { SectionCommonProps } from "@/types";

type CouponStatusProps = Pick<SectionCommonProps, "setValue"> & {
  isActive: boolean;
};

function CouponStatus({ isActive, setValue }: CouponStatusProps) {
  return (
    <section className="space-y-3 dark:text-neutral-100">
      <div className="border-b pb-2 text-right">
        <h3 className="text-sm font-medium">وضعیت کد تخفیف</h3>
      </div>
      <div className="flex items-center justify-between gap-4 rounded-lg border p-3">
        <div className="space-y-0.5 text-right">
          <Label
            htmlFor="isActive"
            className="cursor-pointer text-sm font-medium"
          >
            کد تخفیف فعال باشد
          </Label>
          <p className="text-muted-foreground text-xs">
            کاربران در صورت فعال بودن می‌توانند از این کد استفاده کنند.
          </p>
        </div>
        <Switch
          id="isActive"
          checked={isActive}
          onCheckedChange={(value) =>
            setValue("isActive", value, { shouldDirty: true })
          }
        />
      </div>
      <div className="flex items-center justify-end gap-2 text-xs">
        <span className="text-muted-foreground">وضعیت:</span>
        <span
          className={cn(
            "font-medium",
            isActive ? "text-primary" : "text-muted-foreground",
          )}
        >
          {isActive ? "فعال" : "غیرفعال"}
        </span>
        {isActive && <Check className="text-primary size-3.5" />}
      </div>
    </section>
  );
}
export default CouponStatus;
