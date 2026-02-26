"use client";

import { useState, useTransition, useEffect } from "react";
import { useForm, Controller } from "react-hook-form"; // ✅ Controller اضافه شد
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams, useRouter } from "next/navigation";
import { Smartphone, Mail, Timer, ArrowLeft } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"; // ✅ کامپوننت‌های OTP اضافه شدند

import { SignupFormValues } from "@/types";
import { signupFormSchema } from "@/lib/validations/usersValidations";
import { showErrorToast, showSuccessToast } from "@/lib/utils/showToastMessage";
import { signupAction } from "@/lib/actions/auth.actions";
import { mobileSchema } from "@/lib/validations/smsValidations";
import { sendOtpAction, signinWithOtpAction } from "@/lib/actions/sms.actions";

export default function SignUpForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const router = useRouter();

  // مدیریت تب فعال
  const [activeTab, setActiveTab] = useState("mobile");

  // ============================================================
  // بخش 1: لاجیک فرم ایمیل
  // ============================================================
  const {
    register: registerEmail,
    handleSubmit: handleSubmitEmail,
    formState: { errors: errorsEmail, isSubmitting: isSubmittingEmail },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupFormSchema),
    mode: "onTouched",
  });

  const onEmailSubmit = async (data: SignupFormValues) => {
    const result = await signupAction(data);

    if (result.success) {
      showSuccessToast(
        "ثبت‌نام با موفقیت انجام شد",
        "top-right",
        "ایمیل فعالسازی برای شما ارسال شد",
      );
      router.push("/sign-in");
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
  const [isPending, startTransition] = useTransition();

  const {
    register: registerMobile,
    control: controlMobile, // ✅ control اضافه شد
    formState: { errors: errorsMobile },
    watch: watchMobile,
    trigger: triggerMobile,
    getValues: getMobileValues,
  } = useForm<{ mobile: string; code: string }>({
    resolver: zodResolver(mobileSchema) as any,
    mode: "onTouched",
    defaultValues: {
      mobile: "",
      code: "",
    },
  });

  const mobileValue = watchMobile("mobile");

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

  // ارسال کد تایید
  const onSendOtp = async () => {
    const isValid = await triggerMobile("mobile");
    if (!isValid) return;

    const mobile = getMobileValues("mobile");

    startTransition(async () => {
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

  // تایید نهایی و ثبت‌نام/ورود
  const onVerifyOtp = async () => {
    const { mobile, code } = getMobileValues();
    if (!code || code.length < 5) {
      showErrorToast("کد تایید نامعتبر است", "top-right");
      return;
    }

    startTransition(async () => {
      const result = await signinWithOtpAction({ mobile, code });
      if (result.success) {
        showSuccessToast("خوش آمدید! ثبت‌نام شما انجام شد.", "top-right");
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
        <TabsList className="mb-6 grid w-full grid-cols-2 rounded-full">
          <TabsTrigger value="mobile" className="rounded-full">
            <Smartphone className="ml-2 h-4 w-4" />
            با موبایل
          </TabsTrigger>
          <TabsTrigger value="email" className="rounded-full">
            <Mail className="ml-2 h-4 w-4" />
            با ایمیل
          </TabsTrigger>
        </TabsList>

        {/* --- تب موبایل (ثبت‌نام سریع) --- */}
        <TabsContent value="mobile">
          <div className="space-y-4">
            {step === "mobile" ? (
              <div className="animate-in fade-in slide-in-from-right-4 space-y-4 duration-300">
                <div className="">
                  <Label
                    htmlFor="mobile"
                    className="flex-row-reverse text-right"
                  >
                    شماره موبایل
                  </Label>
                  <Input
                    id="mobile"
                    dir="ltr"
                    type="tel"
                    className="outline-light dark:outline-dark mt-4 rounded-full text-center tracking-widest"
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
                  disabled={isPending}
                  className="mt-4 w-full rounded-full"
                >
                  {isPending ? "در حال ارسال..." : "دریافت کد تایید"}
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
                  <Label htmlFor="code" className="mb-4 block text-center">
                    کد تایید
                  </Label>

                  {/* ✅ استفاده از Controller برای InputOTP */}
                  <div className="flex justify-center" dir="ltr">
                    <Controller
                      control={controlMobile}
                      name="code"
                      render={({ field }) => (
                        <InputOTP
                          maxLength={6}
                          value={field.value}
                          onChange={field.onChange}
                        >
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      )}
                    />
                  </div>

                  {errorsMobile.code && (
                    <p className="text-destructive mt-2 text-center text-sm">
                      {errorsMobile.code.message}
                    </p>
                  )}
                </div>

                <div className="mt-4 flex flex-row-reverse items-center justify-between px-2 text-sm">
                  {timer > 0 ? (
                    <span className="text-muted-foreground flex items-center">
                      <Timer className="ml-1 h-4 w-4" />
                      {formatTime(timer)} تا ارسال مجدد
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={onSendOtp}
                      disabled={isPending}
                      className="text-primary font-medium hover:underline"
                    >
                      ارسال مجدد کد
                    </button>
                  )}
                </div>

                <Button
                  onClick={onVerifyOtp}
                  disabled={isPending}
                  className="mt-4 w-full rounded-full"
                >
                  {isPending ? "در حال بررسی..." : "ثبت‌نام و ورود"}
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        {/* --- تب ایمیل (RTL شده) --- */}
        <TabsContent value="email">
          <form
            onSubmit={handleSubmitEmail(onEmailSubmit)}
            className="space-y-4 text-right" // ✅ راست‌چین کردن کل فرم
            dir="rtl" // ✅ جهت دایرکشن راست به چپ
          >
            <div>
              <Label htmlFor="name">نام و نام خانوادگی</Label>
              <Input
                id="name"
                dir="rtl"
                {...registerEmail("name")}
                className="outline-light dark:outline-dark mt-2 rounded-full"
                placeholder="نام خود را وارد کنید"
              />
              {errorsEmail.name && (
                <p className="text-destructive mt-2">
                  {errorsEmail.name.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="email">ایمیل</Label>
              <Input
                id="email"
                dir="rtl" // اگرچه ایمیل انگلیسی است اما در فرم فارسی پلیس‌هولدر راست‌چین زیباتر است
                type="email"
                {...registerEmail("email")}
                className="outline-light dark:outline-dark mt-2 flex-row-reverse rounded-full text-right" // تایپ کردن چپ‌چین باشد
                placeholder="name@example.com"
              />
              {errorsEmail.email && (
                <p className="text-destructive mt-2 text-sm">
                  {errorsEmail.email.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="password">رمز عبور</Label>
              <Input
                id="password"
                dir="rtl"
                type="password"
                {...registerEmail("password")}
                className="outline-light dark:outline-dark mt-2 rounded-full"
                placeholder="حداقل ۶ کاراکتر"
              />
              {errorsEmail.password && (
                <p className="text-destructive mt-2 text-sm">
                  {errorsEmail.password.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="confirmPassword">تکرار رمز عبور</Label>
              <Input
                id="confirmPassword"
                dir="rtl"
                type="password"
                {...registerEmail("confirmPassword")}
                className="outline-light dark:outline-dark mt-2 rounded-full"
                placeholder="تکرار رمز عبور"
              />
              {errorsEmail.confirmPassword && (
                <p className="text-destructive mt-2 text-sm">
                  {errorsEmail.confirmPassword.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmittingEmail}
              className="mt-4 w-full rounded-full"
            >
              {isSubmittingEmail ? "در حال ارسال..." : "ثبت‌نام"}
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
}
