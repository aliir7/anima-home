"use client";

import type { Control, FieldErrors, UseFormTrigger } from "react-hook-form";

import { Button } from "@/components/ui/button";

import OtpCodeInput from "./OtpCodeInput";
import { OtpValues } from "@/types";
import OtpHeader from "./OtpHeader";
import OtpTimer from "./OtpTimer";

type Props = {
  mobile: string;

  control: Control<OtpValues>;

  trigger: UseFormTrigger<OtpValues>;

  errors: FieldErrors<OtpValues>;

  timer: number;

  formatTime: (time: number) => string;

  isPending: boolean;

  submitText: string;

  onEdit: () => void;

  onResend: () => void;

  onVerify: () => void;
};

export default function OtpForm({
  mobile,
  control,
  trigger,
  errors,
  timer,
  formatTime,
  isPending,
  submitText,
  onEdit,
  onResend,
  onVerify,
}: Props) {
  return (
    <div className="animate-in fade-in slide-in-from-right-4 space-y-6 duration-300">
      <OtpHeader mobile={mobile} onEdit={onEdit} />

      <OtpCodeInput
        control={control}
        trigger={trigger}
        error={errors.code?.message}
        onComplete={onVerify}
      />

      <OtpTimer
        timer={timer}
        formatTime={formatTime}
        isPending={isPending}
        onResend={onResend}
      />

      <Button
        type="button"
        onClick={onVerify}
        disabled={isPending}
        className="h-12 w-full rounded-xl"
      >
        {isPending ? "در حال بررسی..." : submitText}
      </Button>
    </div>
  );
}
