"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Smartphone, Mail, Timer, ArrowLeft } from "lucide-react";
import Link from "next/link";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CardFooter } from "@/components/ui/card";

import { SigninValues } from "@/types";
import { signinSchema } from "@/lib/validations/usersValidations";
import { showErrorToast, showSuccessToast } from "@/lib/utils/showToastMessage";
import { signinWithCredentials } from "@/lib/actions/auth.actions";
import { mobileSchema } from "@/lib/validations/smsValidations";
import { sendOtpAction, signinWithOtpAction } from "@/lib/actions/sms.actions";

type SignInFormProps = {
  verified?: boolean;
  callbackUrl?: string;
};

export default function SignInForm({ verified }: SignInFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("mobile"); // پیش‌فرض روی موبایل

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
  // بخش 1: لاجیک فرم ایمیل (کد قبلی شما بدون تغییر)
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
  // بخش 2: لاجیک فرم موبایل (OTP)
  // ============================================================
  const [step, setStep] = useState<"mobile" | "code">("mobile");
  const [timer, setTimer] = useState(0);
  const [isPendingMobile, startTransitionMobile] = useTransition();

  const {
    register: registerMobile,
    formState: { errors: errorsMobile },
    watch: watchMobile,
    trigger: triggerMobile,
    getValues: getMobileValues,
  } = useForm<{ mobile: string; code: string }>({
    resolver: zodResolver(mobileSchema) as any,
    mode: "onChange",
  });

  const mobileValue = watchMobile("mobile");

  // تایمر معکوس برای ارسال مجدد کد
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

  // ارسال کد تایید
  const onSendOtp = async () => {
    const isValid = await triggerMobile("mobile");
    if (!isValid) return;

    const mobile = getMobileValues("mobile");

    startTransitionMobile(async () => {
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

  // تایید کد و ورود
  const onVerifyOtp = async () => {
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

  // ============================================================
  // رندر کامپوننت
  // ============================================================
  return (
    <div className="w-full">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6 grid w-full grid-cols-2">
          <TabsTrigger value="mobile">
            <Smartphone className="ml-2 h-4 w-4" />
            با موبایل
          </TabsTrigger>
          <TabsTrigger value="email">
            <Mail className="ml-2 h-4 w-4" />
            با ایمیل
          </TabsTrigger>
        </TabsList>

        {/* --- تب موبایل (ورود با کد یکبار مصرف) --- */}
        <TabsContent value="mobile">
          <div className="space-y-6">
            {step === "mobile" ? (
              <div className="animate-in fade-in slide-in-from-right-4 space-y-4 duration-300">
                <div className="">
                  <Label htmlFor="mobile" className="flex-row-reverse">
                    شماره موبایل
                  </Label>
                  <Input
                    id="mobile"
                    dir="ltr"
                    type="tel"
                    className="outline-light dark:outline-dark my-4 rounded-full text-center tracking-widest"
                    placeholder="09xxxxxxxxx"
                    {...registerMobile("mobile")}
                  />
                  {errorsMobile.mobile && (
                    <p className="text-destructive mt-2 text-sm">
                      {errorsMobile.mobile.message}
                    </p>
                  )}
                </div>
                <Button
                  onClick={onSendOtp}
                  disabled={isPendingMobile}
                  className="mt-6 w-full rounded-full"
                >
                  {isPendingMobile ? "در حال ارسال..." : "دریافت کد تایید"}
                </Button>
              </div>
            ) : (
              <div className="animate-in fade-in slide-in-from-right-4 space-y-4 duration-300">
                <div className="mb-2 text-center">
                  <p className="text-muted-foreground text-sm">
                    کد ارسال شده به {mobileValue}
                  </p>
                  <button
                    onClick={() => setStep("mobile")}
                    className="text-primary mt-1 flex w-full items-center justify-center text-xs hover:underline"
                  >
                    <ArrowLeft className="mr-1 h-3 w-3" />
                    ویرایش شماره
                  </button>
                </div>

                <div>
                  <Label htmlFor="code">کد تایید</Label>
                  <Input
                    id="code"
                    dir="ltr"
                    maxLength={6}
                    className="outline-light dark:outline-dark my-4 rounded-full text-center text-lg font-bold tracking-[10px]"
                    placeholder="- - - - - -"
                    {...registerMobile("code")}
                  />
                </div>

                <div className="flex items-center justify-between px-2 text-sm">
                  {timer > 0 ? (
                    <span className="text-muted-foreground flex items-center">
                      <Timer className="ml-1 h-4 w-4" />
                      {formatTime(timer)} تا ارسال مجدد
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={onSendOtp}
                      disabled={isPendingMobile}
                      className="text-primary font-medium hover:underline"
                    >
                      ارسال مجدد کد
                    </button>
                  )}
                </div>

                <Button
                  onClick={onVerifyOtp}
                  disabled={isPendingMobile}
                  className="mt-6 w-full rounded-full"
                >
                  {isPendingMobile ? "در حال بررسی..." : "ورود"}
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        {/* --- تب ایمیل (کد قبلی شما) --- */}
        <TabsContent value="email">
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

            <div className="relative">
              <Label htmlFor="password" className="flex-row-reverse">
                رمز عبور
              </Label>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                className="outline-light dark:outline-dark my-4 rounded-full"
                placeholder="رمز عبور خود را وارد کنید"
                {...registerEmail("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-muted-foreground hover:text-foreground absolute end-3 top-10"
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

            {/* لینک فراموشی رمز فقط در تب ایمیل منطقی است */}
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

      {/* --- پانویس مشترک برای هر دو تب --- */}
      <CardFooter className="text-muted-foreground mt-2 flex flex-col items-center gap-4 pb-4 text-sm">
        <Link href="/sign-up">
          حساب کاربری ندارید؟{" "}
          <span className="text-primary hover:underline">ثبت‌نام کنید</span>
        </Link>
      </CardFooter>
    </div>
  );
}
