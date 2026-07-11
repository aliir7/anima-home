"use client";

import { useRef } from "react";
import { Controller, type Control, type UseFormTrigger } from "react-hook-form";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { Label } from "@/components/ui/label";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import type { OtpValues } from "@/types/index";

type Props = {
  control: Control<OtpValues>;
  trigger: UseFormTrigger<OtpValues>;
  error?: string;
  onComplete?: () => void;
};

export default function OtpCodeInput({
  control,
  trigger,
  error,
  onComplete,
}: Props) {
  const submittedRef = useRef(false);

  return (
    <div className="space-y-4">
      <Label className="block text-center">کد تایید</Label>

      <div className="flex justify-center" dir="ltr">
        <Controller
          control={control}
          name="code"
          render={({ field }) => (
            <InputOTP
              autoFocus
              pattern={REGEXP_ONLY_DIGITS}
              maxLength={6}
              value={field.value}
              onChange={async (value) => {
                field.onChange(value);

                const valid = await trigger("code");

                if (value.length < 6) {
                  submittedRef.current = false;
                  return;
                }

                if (valid && !submittedRef.current) {
                  submittedRef.current = true;
                  onComplete?.();
                }
              }}
            >
              <InputOTPGroup className="gap-2">
                {Array.from({ length: 6 }).map((_, index) => (
                  <InputOTPSlot
                    key={index}
                    index={index}
                    className="h-12 w-12 rounded-xl text-lg font-semibold shadow-sm"
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>
          )}
        />
      </div>

      {error && <p className="text-destructive text-center text-sm">{error}</p>}
    </div>
  );
}
