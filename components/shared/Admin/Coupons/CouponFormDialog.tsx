"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCouponForm } from "@/hooks/useCouponForm";
import { CouponInitialData } from "@/types";
import CouponDiscountInfo from "./CouponDiscountInfo";
import CouponStatus from "./CouponStatus";
import CouponUsageLimits from "./CouponUsageLimits";

type CouponFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: CouponInitialData | null;
};

function CouponFormDialog({
  open,
  onOpenChange,
  initialData,
}: CouponFormDialogProps) {
  const {
    register,
    handleSubmit,
    setValue,
    errors,
    isSubmitting,
    type,
    isActive,
    expiresAt,
    isEdit,
    handleCancel,
  } = useCouponForm({
    initialData,
    onSuccess: () => onOpenChange(false),
  });
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        dir="rtl"
        className="max-h-[90vh] max-w-xl overflow-y-auto"
      >
        <DialogHeader className="items-end text-right sm:text-right dark:text-neutral-50">
          <DialogTitle className="mt-4 w-full text-right text-lg font-semibold">
            {isEdit ? "ویرایش کد تخفیف" : "ایجاد کد تخفیف جدید"}
          </DialogTitle>
          <DialogDescription className="w-full text-right text-sm leading-6">
            {isEdit
              ? "اطلاعات کد تخفیف را ویرایش و تغییرات را ذخیره کنید."
              : "یک کد تخفیف جدید برای استفاده مشتریان ایجاد کنید."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* =====================================================
              اطلاعات تخفیف
          ====================================================== */}
          <CouponDiscountInfo
            type={type}
            register={register}
            errors={errors}
            setValue={setValue}
            isSubmitting={isSubmitting}
            onTypeChange={(value) => setValue("type", value)}
          />

          {/* =====================================================
              محدودیت‌های استفاده
          ====================================================== */}
          <CouponUsageLimits
            expiresAt={expiresAt}
            register={register}
            errors={errors}
            setValue={setValue}
            isSubmitting={isSubmitting}
          />

          {/* =====================================================
              وضعیت
          ====================================================== */}
          <CouponStatus isActive={isActive} setValue={setValue} />

          {/* =====================================================
              Actions
          ====================================================== */}
          <DialogFooter className="flex-col gap-2 sm:flex-row sm:justify-start">
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={() => handleCancel(() => onOpenChange(false))}
              className="dark:text-muted-foreground w-full rounded-full sm:w-auto"
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
export default CouponFormDialog;
