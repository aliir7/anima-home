import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SectionCommonProps } from "@/types";

type CouponUsageLimitsProps = SectionCommonProps & {
  expiresAt: Date | null;
};

function CouponUsageLimits({
  register,
  errors,
  setValue,
  isSubmitting,
  expiresAt,
}: CouponUsageLimitsProps) {
  return (
    <section className="space-y-6 dark:text-neutral-100">
      <div className="space-y-2 border-b pb-2 text-right">
        <h3 className="text-sm font-medium">محدودیت‌های استفاده</h3>
        <p className="text-muted-foreground mt-2 text-xs">
          شرایط و تعداد دفعات قابل استفاده از این کد را مشخص کنید.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* حداقل مبلغ سفارش */}
        <div className="space-y-2">
          <Label htmlFor="minOrderAmount" className="text-right">
            حداقل مبلغ سفارش
          </Label>
          <div className="relative">
            <Input
              id="minOrderAmount"
              type="number"
              dir="ltr"
              inputMode="numeric"
              min={0}
              placeholder="مثلاً ۵۰۰۰۰۰"
              className="pl-14 text-right placeholder:text-right"
              {...register("minOrderAmount", {
                validate: (value) => {
                  if (value === "") return true;
                  return Number(value) >= 0 || "مبلغ نمی‌تواند منفی باشد";
                },
              })}
            />
            <span className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-xs">
              تومان
            </span>
          </div>
          <p className="text-muted-foreground text-right text-xs">
            بدون محدودیت، خالی بگذارید.
          </p>
          {errors.minOrderAmount && (
            <p className="text-destructive text-right text-xs">
              {errors.minOrderAmount.message}
            </p>
          )}
        </div>

        {/* تاریخ انقضا */}
        <div className="space-y-2">
          <Label htmlFor="expiresAt" className="text-right">
            تاریخ انقضا
          </Label>
          <DatePicker
            value={expiresAt}
            onChange={(date) =>
              setValue("expiresAt", date, { shouldDirty: true })
            }
            disabled={isSubmitting}
            placeholder="تاریخ انقضا را انتخاب کنید"
          />
          <p className="text-muted-foreground text-right text-xs">
            بدون تاریخ انقضا، خالی بگذارید.
          </p>
        </div>

        {/* سقف کل استفاده */}
        <div className="space-y-2">
          <Label htmlFor="maxUses" className="text-right">
            سقف کل استفاده
          </Label>
          <Input
            id="maxUses"
            type="number"
            dir="ltr"
            inputMode="numeric"
            min={1}
            placeholder="مثلاً ۱۰۰"
            className="text-left placeholder:text-right"
            {...register("maxUses", {
              validate: (value) => {
                if (value === "") return true;
                return Number(value) >= 1 || "سقف استفاده باید حداقل ۱ باشد";
              },
            })}
          />
          <p className="text-muted-foreground text-right text-xs">
            تعداد دفعات استفاده توسط همه کاربران.
          </p>
          {errors.maxUses && (
            <p className="text-destructive text-right text-xs">
              {errors.maxUses.message}
            </p>
          )}
        </div>

        {/* سقف هر کاربر */}
        <div className="space-y-2">
          <Label htmlFor="maxUsesPerUser" className="text-right">
            سقف استفاده هر کاربر
          </Label>
          <Input
            id="maxUsesPerUser"
            type="number"
            dir="ltr"
            inputMode="numeric"
            min={1}
            placeholder="مثلاً ۲"
            className="text-left placeholder:text-right"
            {...register("maxUsesPerUser", {
              validate: (value) => {
                if (value === "") return true;
                return Number(value) >= 1 || "سقف استفاده باید حداقل ۱ باشد";
              },
            })}
          />
          <p className="text-muted-foreground text-right text-xs">
            تعداد دفعات مجاز برای هر کاربر.
          </p>
          {errors.maxUsesPerUser && (
            <p className="text-destructive text-right text-xs">
              {errors.maxUsesPerUser.message}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
export default CouponUsageLimits;
