"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";

import OtpForm from "@/components/shared/Auth/Otp/OtpForm";
import OtpMobileInput from "@/components/shared/Auth/Otp/OtpMobileInput";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  sendChangePhoneOtpAction,
  verifyChangePhoneOtpAction,
} from "@/lib/actions/account.actions";
import { showErrorToast, showSuccessToast } from "@/lib/utils/showToastMessage";
import { mobileSchema } from "@/lib/validations/smsValidations";
import { OtpValues } from "@/types";

type ChangePhoneFormProps = {
  currentPhone: string | null;
  phoneVerified: boolean;
};

function ChangePhoneForm({ currentPhone, phoneVerified }: ChangePhoneFormProps) {
  const router = useRouter();
  const [step, setStep] = useState<"idle" | "mobile" | "code">("idle");
  const [timer, setTimer] = useState(0);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    control,
    formState: { errors },
    trigger,
    getValues,
    reset,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = useForm<OtpValues>({
    resolver: zodResolver(mobileSchema) as any,
    mode: "onChange",
    defaultValues: { mobile: "", code: "" },
  });

  const mobileValue = useWatch({ control, name: "mobile" });

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  const onSendOtp = () => {
    startTransition(async () => {
      const isValid = await trigger("mobile");
      if (!isValid) return;

      const mobile = getValues("mobile");
      const result = await sendChangePhoneOtpAction(mobile);

      if (!result.success) {
        const message =
          result.error.type === "custom"
            ? result.error.message
            : "شماره موبایل معتبر نیست";
        showErrorToast(message, "top-right");
        return;
      }

      showSuccessToast(result.data ?? "کد تایید ارسال شد", "top-right");
      setStep("code");
      setTimer(120);
    });
  };

  const onVerifyOtp = () => {
    const { mobile, code } = getValues();
    if (!code || code.length < 6) {
      showErrorToast("کد تایید نامعتبر است", "top-right");
      return;
    }

    startTransition(async () => {
      const result = await verifyChangePhoneOtpAction({
        newPhone: mobile,
        code,
      });

      if (!result.success) {
        const message =
          result.error.type === "custom" ? result.error.message : "کد اشتباه است";
        showErrorToast(message, "top-right");
        return;
      }

      showSuccessToast(result.data ?? "شماره موبایل تایید شد", "top-right");
      setStep("idle");
      reset({ mobile: "", code: "" });
      router.refresh();
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="space-y-4 px-6 py-4">
          <h3 className="text-sm font-semibold">وضعیت شماره موبایل</h3>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-muted-foreground text-xs">شماره فعلی</p>
              <p dir="ltr" className="truncate text-sm font-medium">
                {currentPhone ?? "ثبت نشده"}
              </p>
            </div>

            {phoneVerified ? (
              <Badge className="border-transparent bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400">
                تایید شده
              </Badge>
            ) : (
              <Badge className="border-transparent bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400">
                تایید نشده
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-4 px-6 py-4">
          <h3 className="text-sm font-semibold">تغییر شماره موبایل</h3>

          {step === "idle" && (
            <Button
              type="button"
              onClick={() => setStep("mobile")}
              className="cursor-pointer rounded-full"
            >
              تغییر شماره موبایل
            </Button>
          )}

          {step === "mobile" && (
            <OtpMobileInput
              register={register}
              errors={errors}
              isPending={isPending}
              onSubmit={onSendOtp}
            />
          )}

          {step === "code" && (
            <OtpForm
              mobile={mobileValue}
              control={control}
              trigger={trigger}
              errors={errors}
              timer={timer}
              formatTime={formatTime}
              isPending={isPending}
              submitText="تایید و تغییر شماره"
              onEdit={() => setStep("mobile")}
              onResend={onSendOtp}
              onVerify={onVerifyOtp}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default ChangePhoneForm;
