"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { FieldErrors, UseFormRegister } from "react-hook-form";
import { OtpValues } from "@/types/index";

type Props = {
  register: UseFormRegister<OtpValues>;
  errors: FieldErrors<OtpValues>;
  isPending: boolean;
  onSubmit: () => void;
};

export default function OtpMobileInput({
  register,
  errors,
  isPending,
  onSubmit,
}: Props) {
  return (
    <div className="animate-in fade-in slide-in-from-right-4 space-y-6 duration-300">
      <div className="space-y-2">
        <Label htmlFor="mobile" className="ps-2 pb-2" dir="rtl">
          شماره موبایل
        </Label>

        <Input
          id="mobile"
          dir="ltr"
          type="tel"
          disabled={isPending}
          placeholder="09xxxxxxxxx"
          className="rounded-full px-2 py-4 text-center tracking-[0.25em]"
          {...register("mobile")}
        />

        {errors.mobile && (
          <p className="text-destructive text-sm">{errors.mobile.message}</p>
        )}
      </div>

      <Button
        type="button"
        onClick={onSubmit}
        disabled={isPending}
        className="my-2 w-full rounded-full px-2 py-4.5"
      >
        {isPending ? "در حال ارسال..." : "دریافت کد تایید"}
      </Button>
    </div>
  );
}
