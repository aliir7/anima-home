"use client";

import { format as formatGregorian } from "date-fns";
import { Check } from "lucide-react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { createCoupon, updateCoupon } from "@/lib/actions/coupon.actions";
import { showErrorToast, showSuccessToast } from "@/lib/utils/showToastMessage";
import { cn } from "@/lib/utils/utils";

type CouponFormState = {
  code: string;
  type: "percent" | "fixed";
  value: number;
  minOrderAmount: string;
  maxUses: string;
  maxUsesPerUser: string;
  expiresAt: Date | null;
  isActive: boolean;
};

type CouponFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: {
    id: string;
    code: string;
    type: "percent" | "fixed";
    value: number;
    minOrderAmount: number | null;
    maxUses: number | null;
    maxUsesPerUser: number | null;
    expiresAt: Date | null;
    isActive: boolean;
  } | null;
};

function normalizeDate(date: Date | null | undefined) {
  if (!date) return null;
  const value = new Date(date);
  return new Date(value.getFullYear(), value.getMonth(), value.getDate());
}

function toServerDate(date: Date | null) {
  if (!date) return null;
  return formatGregorian(date, "yyyy-MM-dd");
}

export default function CouponFormDialog({
  open,
  onOpenChange,
  initialData,
}: CouponFormDialogProps) {
  const isEdit = Boolean(initialData);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CouponFormState>({
    values: {
      code: initialData?.code ?? "",
      type: initialData?.type ?? "percent",
      value: initialData?.value ?? 0,
      minOrderAmount: initialData?.minOrderAmount?.toString() ?? "",
      maxUses: initialData?.maxUses?.toString() ?? "",
      maxUsesPerUser: initialData?.maxUsesPerUser?.toString() ?? "",
      expiresAt: normalizeDate(initialData?.expiresAt),
      isActive: initialData?.isActive ?? true,
    },
  });

  const type = watch("type");
  const isActive = watch("isActive");
  const expiresAt = watch("expiresAt");

  const onSubmit = async (formValues: CouponFormState) => {
    const payload = {
      code: formValues.code.trim().toUpperCase(),
      type: formValues.type,
      value: Number(formValues.value),
      minOrderAmount:
        formValues.minOrderAmount === ""
          ? null
          : Number(formValues.minOrderAmount),
      maxUses: formValues.maxUses === "" ? null : Number(formValues.maxUses),
      maxUsesPerUser:
        formValues.maxUsesPerUser === ""
          ? null
          : Number(formValues.maxUsesPerUser),
      expiresAt: toServerDate(formValues.expiresAt),
      isActive: formValues.isActive,
    };

    const res = isEdit
      ? await updateCoupon(initialData!.id, payload)
      : await createCoupon(payload);

    if (!res.success) {
      const message =
        res.error.type === "custom"
          ? res.error.message
          : "اطلاعات واردشده معتبر نیست.";
      showErrorToast(message, "top-right");
      return;
    }

    showSuccessToast(res.data ?? "عملیات با موفقیت انجام شد", "top-right");
    reset();
    onOpenChange(false);
  };

  const handleCancel = () => {
    if (isSubmitting) return;
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        dir="rtl"
        className="max-h-[90vh] max-w-lg overflow-y-auto"
      >
        <DialogHeader className="items-end text-right sm:text-right">
          <DialogTitle className="w-full text-right text-lg font-semibold">
            {isEdit ? "ویرایش کد تخفیف" : "ایجاد کد تخفیف جدید"}
          </DialogTitle>
          <DialogDescription className="w-full text-right text-sm leading-6">
            {isEdit
              ? "اطلاعات کد تخفیف را ویرایش و تغییرات را ذخیره کنید."
              : "یک کد تخفیف جدید برای استفاده مشتریان ایجاد کنید."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* =====================================================
              اطلاعات تخفیف
          ====================================================== */}
          <section className="space-y-4">
            <div className="border-b pb-2 text-right">
              <h3 className="text-sm font-medium">اطلاعات تخفیف</h3>
              <p className="text-muted-foreground mt-1 text-xs">
                نوع و مقدار تخفیف را مشخص کنید.
              </p>
            </div>

            {/* کد تخفیف */}
            <div className="space-y-2">
              <Label htmlFor="code" className="text-right">
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
                    message:
                      "کد تخفیف باید فقط شامل حروف انگلیسی، عدد، _ یا - باشد",
                  },
                })}
              />
              <p className="text-muted-foreground text-right text-xs">
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
                onValueChange={(value) =>
                  setValue("type", value as "percent" | "fixed")
                }
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
                  className="pl-16 text-left placeholder:text-right"
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

          {/* =====================================================
              محدودیت‌های استفاده
          ====================================================== */}
          <section className="space-y-4">
            <div className="border-b pb-2 text-right">
              <h3 className="text-sm font-medium">محدودیت‌های استفاده</h3>
              <p className="text-muted-foreground mt-1 text-xs">
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
                    className="pl-14 text-left placeholder:text-right"
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

              {/* تاریخ انقضا — استفاده از DatePicker ماژولار */}
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
                      return (
                        Number(value) >= 1 || "سقف استفاده باید حداقل ۱ باشد"
                      );
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
                      return (
                        Number(value) >= 1 || "سقف استفاده باید حداقل ۱ باشد"
                      );
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

          {/* =====================================================
              وضعیت
          ====================================================== */}
          <section className="space-y-3">
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

          {/* =====================================================
              Actions
          ====================================================== */}
          <DialogFooter className="flex-col-reverse gap-2 sm:flex-row sm:justify-start">
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={handleCancel}
              className="w-full rounded-full sm:w-auto"
            >
              انصراف
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-full sm:w-auto"
            >
              {isSubmitting
                ? "در حال ذخیره..."
                : isEdit
                  ? "ذخیره تغییرات"
                  : "ایجاد کد تخفیف"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
