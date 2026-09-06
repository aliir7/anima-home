import { useForm } from "react-hook-form";

import { createCoupon, updateCoupon } from "@/lib/actions/coupon.actions";
import { showErrorToast, showSuccessToast } from "@/lib/utils/showToastMessage";
import { toServerDate } from "@/lib/utils/dateUtils";
import { CouponFormState, CouponInitialData } from "@/types";

type UseCouponFormOptions = {
  initialData: CouponInitialData | null | undefined;
  onSuccess: () => void;
};

export function useCouponForm({
  initialData,
  onSuccess,
}: UseCouponFormOptions) {
  const isEdit = Boolean(initialData);

  const form = useForm<CouponFormState>({
    values: {
      code: initialData?.code ?? "",
      type: initialData?.type ?? "percent",
      value: initialData?.value ?? 0,
      minOrderAmount: initialData?.minOrderAmount?.toString() ?? "",
      maxUses: initialData?.maxUses?.toString() ?? "",
      maxUsesPerUser: initialData?.maxUsesPerUser?.toString() ?? "",
      expiresAt: initialData?.expiresAt
        ? new Date(
            initialData.expiresAt.getFullYear(),
            initialData.expiresAt.getMonth(),
            initialData.expiresAt.getDate(),
          )
        : null,
      isActive: initialData?.isActive ?? true,
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = form;

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
    onSuccess();
  };

  const handleCancel = (onClose: () => void) => {
    if (isSubmitting) return;
    reset();
    onClose();
  };

  return {
    form,
    register,
    handleSubmit: handleSubmit(onSubmit),
    watch,
    setValue,
    reset,
    errors,
    isSubmitting,
    type,
    isActive,
    expiresAt,
    isEdit,
    handleCancel,
  };
}
