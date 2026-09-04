"use client";

import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { createCoupon, updateCoupon } from "@/lib/actions/coupon.actions";
import { showErrorToast, showSuccessToast } from "@/lib/utils/showToastMessage";

// این تایپ فقط برای فرم سمت کلاینت است (ساده و بدون coercion پیچیده) —
// اعتبارسنجی نهایی و قطعی همیشه سمت سرور با createCouponSchema/updateCouponSchema
// انجام می‌شود، پس اینجا نیازی به دوباره‌کاری آن منطق نیست.
type CouponFormState = {
  code: string;
  type: "percent" | "fixed";
  value: number;
  minOrderAmount: string;
  maxUses: string;
  maxUsesPerUser: string;
  expiresAt: string;
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

function toDateInputValue(date: Date | null | undefined) {
  if (!date) return "";
  return new Date(date).toISOString().slice(0, 10);
}

export default function CouponFormDialog({
  open,
  onOpenChange,
  initialData,
}: CouponFormDialogProps) {
  const isEdit = !!initialData;

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
      expiresAt: toDateInputValue(initialData?.expiresAt),
      isActive: initialData?.isActive ?? true,
    },
  });

  const type = watch("type");
  const isActive = watch("isActive");

  const onSubmit = async (formValues: CouponFormState) => {
    const payload = {
      code: formValues.code,
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
      expiresAt: formValues.expiresAt === "" ? null : formValues.expiresAt,
      isActive: formValues.isActive,
    };

    const res = isEdit
      ? await updateCoupon(initialData!.id, payload)
      : await createCoupon(payload);

    if (!res.success) {
      const message =
        res.error.type === "custom"
          ? res.error.message
          : "ورودی نامعتبر است، دوباره بررسی کنید";
      showErrorToast(message, "top-right");
      return;
    }

    showSuccessToast(res.data ?? "با موفقیت انجام شد", "top-right");
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md text-right dark:text-white">
        <DialogHeader className="">
          <DialogTitle>
            {isEdit ? "ویرایش کد تخفیف" : "کد تخفیف جدید"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="code">کد تخفیف</Label>
            <Input
              id="code"
              dir="ltr"
              className="uppercase"
              placeholder="مثال: SUMMER20"
              {...register("code", { required: "کد الزامی است" })}
            />
            {errors.code && (
              <p className="text-destructive text-xs">{errors.code.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label>نوع تخفیف</Label>
            <RadioGroup
              value={type}
              onValueChange={(v) => setValue("type", v as "percent" | "fixed")}
              className="flex gap-4"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="percent" id="type-percent" />
                <Label
                  htmlFor="type-percent"
                  className="cursor-pointer font-normal"
                >
                  درصدی
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="fixed" id="type-fixed" />
                <Label
                  htmlFor="type-fixed"
                  className="cursor-pointer font-normal"
                >
                  مبلغ ثابت (تومان)
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="value">
              {type === "percent" ? "درصد تخفیف" : "مبلغ تخفیف (تومان)"}
            </Label>
            <Input
              id="value"
              type="number"
              {...register("value", { required: true, valueAsNumber: true })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="minOrderAmount">حداقل مبلغ سفارش (اختیاری)</Label>
              <Input
                id="minOrderAmount"
                type="number"
                {...register("minOrderAmount")}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="expiresAt">تاریخ انقضا (اختیاری)</Label>
              <Input id="expiresAt" type="date" {...register("expiresAt")} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="maxUses">سقف کل استفاده (اختیاری)</Label>
              <Input id="maxUses" type="number" {...register("maxUses")} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="maxUsesPerUser">سقف هر کاربر (اختیاری)</Label>
              <Input
                id="maxUsesPerUser"
                type="number"
                {...register("maxUsesPerUser")}
              />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg border px-3 py-2">
            <Label htmlFor="isActive">فعال باشد</Label>
            <Switch
              id="isActive"
              checked={isActive}
              onCheckedChange={(v) => setValue("isActive", v)}
            />
          </div>

          <DialogFooter>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 w-full rounded-full"
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
