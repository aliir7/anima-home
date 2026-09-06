import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils/utils";
import { CouponType, SectionCommonProps } from "@/types";

type CouponDiscountInfoProps = SectionCommonProps & {
  type: CouponType;
  onTypeChange: (value: CouponType) => void;
};

function CouponDiscountInfo({
  type,
  register,
  errors,
  onTypeChange,
}: CouponDiscountInfoProps) {
  return (
    <section className="space-y-6 dark:text-neutral-100">
      <div className="border-b pb-2 text-right">
        <h3 className="text-sm font-medium">اطلاعات تخفیف</h3>
        <p className="text-muted-foreground mt-1 text-xs">
          نوع و مقدار تخفیف را مشخص کنید.
        </p>
      </div>

      {/* کد تخفیف */}
      <div className="space-y-2">
        <Label htmlFor="code" className="pb-1 text-right">
          کد تخفیف
          <span className="text-destructive mr-1">*</span>
        </Label>
        <Input
          id="code"
          dir="ltr"
          inputMode="text"
          autoComplete="off"
          placeholder="مثال: SUMMER20"
          className={cn(
            "text-left tracking-wide uppercase",
            "placeholder:text-right",
          )}
          aria-invalid={Boolean(errors.code)}
          {...register("code", {
            required: "کد تخفیف الزامی است",
            minLength: {
              value: 3,
              message: "کد تخفیف باید حداقل ۳ کاراکتر باشد",
            },
            maxLength: {
              value: 50,
              message: "کد تخفیف نمی‌تواند بیشتر از ۵۰ کاراکتر باشد",
            },
            pattern: {
              value: /^[A-Za-z0-9_-]+$/,
              message: "کد تخفیف باید فقط شامل حروف انگلیسی، عدد، _ یا - باشد",
            },
          })}
        />
        <p className="text-muted-foreground pt-0.5 pb-1 text-right text-xs">
          کد تخفیف را به صورت انگلیسی وارد کنید.
        </p>
        {errors.code && (
          <p className="text-destructive text-right text-xs">
            {errors.code.message}
          </p>
        )}
      </div>

      {/* نوع تخفیف */}
      <div className="space-y-2">
        <Label className="text-right">نوع تخفیف</Label>
        <RadioGroup
          value={type}
          onValueChange={(value) => onTypeChange(value as CouponType)}
          dir="rtl"
          className="grid grid-cols-1 gap-3 sm:grid-cols-2"
        >
          <label
            htmlFor="type-percent"
            className={cn(
              "flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors",
              type === "percent"
                ? "border-primary bg-accent"
                : "hover:bg-accent/50",
            )}
          >
            <RadioGroupItem value="percent" id="type-percent" />
            <div className="text-right">
              <p className="text-sm font-medium">درصدی</p>
              <p className="text-muted-foreground text-xs">مثال: ۲۰٪</p>
            </div>
          </label>
          <label
            htmlFor="type-fixed"
            className={cn(
              "flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors",
              type === "fixed"
                ? "border-primary bg-accent"
                : "hover:bg-accent/50",
            )}
          >
            <RadioGroupItem value="fixed" id="type-fixed" />
            <div className="text-right">
              <p className="text-sm font-medium">مبلغ ثابت</p>
              <p className="text-muted-foreground text-xs">
                مثال: ۵۰٬۰۰۰ تومان
              </p>
            </div>
          </label>
        </RadioGroup>
      </div>

      {/* مقدار تخفیف */}
      <div className="space-y-2">
        <Label htmlFor="value" className="text-right">
          {type === "percent" ? "درصد تخفیف" : "مبلغ تخفیف"}
          <span className="text-destructive mr-1">*</span>
        </Label>
        <div className="relative">
          <Input
            id="value"
            type="number"
            dir="ltr"
            inputMode="numeric"
            min={type === "percent" ? 1 : 0}
            max={type === "percent" ? 100 : undefined}
            placeholder={type === "percent" ? "مثلاً ۲۰" : "مثلاً ۵۰۰۰۰"}
            className="pl-16 text-right placeholder:text-right"
            aria-invalid={Boolean(errors.value)}
            {...register("value", {
              required: "مقدار تخفیف الزامی است",
              valueAsNumber: true,
              min: {
                value: type === "percent" ? 1 : 0,
                message:
                  type === "percent"
                    ? "درصد تخفیف باید حداقل ۱ باشد"
                    : "مبلغ تخفیف نمی‌تواند منفی باشد",
              },
              max:
                type === "percent"
                  ? {
                      value: 100,
                      message: "درصد تخفیف نمی‌تواند بیشتر از ۱۰۰ باشد",
                    }
                  : undefined,
            })}
          />
          <span className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-xs">
            {type === "percent" ? "درصد" : "تومان"}
          </span>
        </div>
        {errors.value && (
          <p className="text-destructive text-right text-xs">
            {errors.value.message}
          </p>
        )}
      </div>
    </section>
  );
}
export default CouponDiscountInfo;
