import type {
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";

export type CouponType = "percent" | "fixed";

export type CouponFormState = {
  code: string;
  type: CouponType;
  value: number;
  minOrderAmount: string;
  maxUses: string;
  maxUsesPerUser: string;
  expiresAt: Date | null;
  isActive: boolean;
};

export type CouponInitialData = {
  id: string;
  code: string;
  type: CouponType;
  value: number;
  minOrderAmount: number | null;
  maxUses: number | null;
  maxUsesPerUser: number | null;
  expiresAt: Date | null;
  isActive: boolean;
};

// Props مشترک بین section ها
export type SectionCommonProps = {
  register: UseFormRegister<CouponFormState>;
  errors: FieldErrors<CouponFormState>;
  setValue: UseFormSetValue<CouponFormState>;
  isSubmitting: boolean;
};
