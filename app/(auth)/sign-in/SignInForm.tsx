"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Mail, Smartphone } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form"; // ✅ Controller اضافه شد

import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWatch } from "react-hook-form";
import OtpForm from "@/components/shared/Auth/Otp/OtpForm";
import OtpMobileInput from "@/components/shared/Auth/Otp/OtpMobileInput";
import { signinWithCredentials } from "@/lib/actions/auth.actions";
import { sendOtpAction, signinWithOtpAction } from "@/lib/actions/sms.actions";
import { showErrorToast, showSuccessToast } from "@/lib/utils/showToastMessage";
import { mobileSchema } from "@/lib/validations/smsValidations";
import { signinSchema } from "@/lib/validations/usersValidations";
import { SigninValues } from "@/types";

type SignInFormProps = {
  verified?: boolean;
  callbackUrl?: string;
};

export default function SignInForm({ verified }: SignInFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("mobile");

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const router = useRouter();

  useEffect(() => {
    if (verified) {
      showSuccessToast(
        "ایمیل شما با موفقیت تأیید شد ✅ اکنون می‌توانید وارد شوید.",
        "top-right",
      );
    }
  }, [verified]);

  // ============================================================
  // بخش 1: لاجیک فرم ایمیل
  // ============================================================
  const {
    register: registerEmail,
    formState: { errors: errorsEmail, isSubmitting: isSubmittingEmail },
    watch: watchEmail,
    handleSubmit: handleSubmitEmail,
  } = useForm<SigninValues>({
    resolver: zodResolver(signinSchema),
    mode: "onSubmit",
  });

  const emailValue = watchEmail("email");

  const onEmailSubmit = async (data: SigninValues) => {
    const result = await signinWithCredentials(data);
    if (result.success) {
      showSuccessToast("با موفقیت وارد شدید", "top-right");
      router.push(callbackUrl);
      router.refresh();
    }
    if (!result.success && result.error.type === "custom") {
      showErrorToast(result.error.message, "top-right");
    }
  };

  // ============================================================
  // بخش 2: لاجیک فرم موبایل (OTP) - ✅ اصلاح شده
  // ============================================================
  const [step, setStep] = useState<"mobile" | "code">("mobile");
  const [timer, setTimer] = useState(0);
  const [isPendingMobile, startTransitionMobile] = useTransition();

  const {
    register: registerMobile,
    control: controlMobile, // ✅ این خط اضافه شد
    formState: { errors: errorsMobile, isSubmitting },
    watch: watchMobile,
    trigger: triggerMobile,
    getValues: getMobileValues,
  } = useForm<{ mobile: string; code: string }>({
    resolver: zodResolver(mobileSchema) as any,
    mode: "onChange",
    defaultValues: {
      mobile: "",
      code: "",
    },
  });

  const mobileValue = useWatch({
    control: controlMobile,
    name: "mobile",
  });

  // تایمر معکوس
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

  const onSendOtp = async () => {
    const isValid = await triggerMobile("mobile");
    if (!isValid) return;

    const mobile = getMobileValues("mobile");

    startTransitionMobile(async () => {
      // شبیه‌سازی ارسال (یا فراخوانی اکشن واقعی)
      const result = await sendOtpAction(mobile);
      if (result.success) {
        showSuccessToast("کد تایید ارسال شد", "top-right");
        setStep("code");
        setTimer(120);
      } else {
        showErrorToast(result.message || "خطا در ارسال پیامک", "top-right");
      }
    });
  };

  const onVerifyOtp = async () => {
    // برای سابمیت نهایی می‌توانیم از handleSubmit هم استفاده کنیم، اما روش دستی شما هم صحیح است
    const { mobile, code } = getMobileValues();
    if (!code || code.length < 5) {
      showErrorToast("کد تایید نامعتبر است", "top-right");
      return;
    }

    startTransitionMobile(async () => {
      const result = await signinWithOtpAction({ mobile, code });
      if (result.success) {
        showSuccessToast("با موفقیت وارد شدید", "top-right");
        router.push(callbackUrl);
        router.refresh();
      } else {
        showErrorToast(result.error?.message || "کد اشتباه است", "top-right");
      }
    });
  };

  return (
    <div className="w-full">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6 grid w-full grid-cols-2 rounded-full">
          <TabsTrigger value="mobile" className="rounded-full">
            <Smartphone className="ml-2 h-4 w-4" />
            با موبایل
          </TabsTrigger>
          <TabsTrigger value="email">
            <Mail className="ml-2 h-4 w-4" />
            با ایمیل
          </TabsTrigger>
        </TabsList>

        {/* --- تب موبایل --- */}
        <TabsContent value="mobile" className="rounded-full">
          <div className="space-y-6">
            {step === "mobile" ? (
              <OtpMobileInput
                register={registerMobile}
                errors={errorsMobile}
                isPending={isSubmitting}
                onSubmit={onSendOtp}
              />
            ) : (
              <OtpForm
                mobile={mobileValue}
                control={controlMobile}
                trigger={triggerMobile}
                errors={errorsMobile}
                timer={timer}
                formatTime={formatTime}
                isPending={isSubmitting}
                submitText="ورود"
                onEdit={() => setStep("mobile")}
                onResend={onSendOtp}
                onVerify={onVerifyOtp}
              />
            )}
          </div>
        </TabsContent>

        {/* --- تب ایمیل --- */}
        <TabsContent value="email" className="rounded-full">
          {/* ... همان کدهای قبلی ... */}
          <form
            className="space-y-6 text-right"
            onSubmit={handleSubmitEmail(onEmailSubmit)}
          >
            <div>
              <Label htmlFor="email" className="flex-row-reverse">
                ایمیل
              </Label>
              <Input
                id="email"
                dir="rtl"
                type="email"
                className="outline-light dark:outline-dark my-4 rounded-full"
                placeholder="ایمیل خود را وارد کنید"
                {...registerEmail("email")}
              />
              {errorsEmail.email && (
                <p className="text-destructive mt-2">
                  {errorsEmail.email.message}
                </p>
              )}
            </div>

            <div className="relative flex-row-reverse">
              <Label htmlFor="password" className="flex-row-reverse">
                رمز عبور
              </Label>
              <Input
                id="password"
                dir="rtl"
                type={showPassword ? "text" : "password"}
                className="outline-light dark:outline-dark my-4 rounded-full"
                placeholder="رمز عبور خود را وارد کنید"
                {...registerEmail("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-muted-foreground hover:text-foreground absolute inset-s-3 top-10"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
              {errorsEmail.password && (
                <p className="text-destructive mt-2">
                  {errorsEmail.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="mt-6 w-full rounded-full"
              disabled={isSubmittingEmail}
            >
              {isSubmittingEmail ? "در حال ورود..." : "ورود"}
            </Button>

            <div className="mt-4 text-center">
              <Link
                href={`/forgot-password${emailValue ? `?email=${encodeURIComponent(emailValue)}` : ""}`}
                className="text-muted-foreground text-sm hover:underline"
              >
                رمز عبور را فراموش کرده‌اید؟
              </Link>
            </div>
          </form>
        </TabsContent>
      </Tabs>

      <CardFooter className="text-muted-foreground mt-2 flex flex-col items-center gap-4 pb-4 text-sm">
        <Link href="/sign-up">
          حساب کاربری ندارید؟{" "}
          <span className="text-primary hover:underline">ثبت‌نام کنید</span>
        </Link>
      </CardFooter>
    </div>
  );
}
