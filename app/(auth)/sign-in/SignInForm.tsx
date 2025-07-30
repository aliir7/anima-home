"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { SigninValues } from "@/types";
import { signinSchema } from "@/lib/validations/usersValidations";
import { showErrorToast, showSuccessToast } from "@/lib/utils/showToastMessage";
import { signinWithCredentials } from "@/lib/actions/auth.actions";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { CardFooter } from "@/components/ui/card";
import Link from "next/link";

type SignInFormProps = {
  verified?: boolean;
  callbackUrl?: string;
};

function SignInForm({ verified }: SignInFormProps) {
  const [showPassword, setShowPassword] = useState(false);

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

  const {
    register,
    formState: { errors, isSubmitting },
    watch,
    handleSubmit,
  } = useForm<SigninValues>({
    resolver: zodResolver(signinSchema),
    mode: "onSubmit",
  });

  const email = watch("email");

  // signin handler action
  const onSubmit = async (data: SigninValues) => {
    const result = await signinWithCredentials(data);
    if (result.success) {
      showSuccessToast(
        "ثبت‌نام موفق بود. لطفاً ایمیل خود را برای تأیید بررسی کنید ✉️",
        "top-right",
      );
      router.push(callbackUrl);
    }
    if (!result.success && result.error.type === "custom") {
      showErrorToast(result.error.message, "top-right");
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <Label htmlFor="email">ایمیل</Label>
        <Input
          id="email"
          type="email"
          className="outline-light dark:outline-dark my-4 rounded-full"
          placeholder="ایمیل خود را وارد کنید"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-destructive mt-2">{errors.email.message}</p>
        )}
      </div>

      <div className="relative">
        <Label htmlFor="password">رمز عبور</Label>
        <Input
          id="password"
          type={showPassword ? "text" : "password"}
          className="outline-light dark:outline-dark my-4 rounded-full"
          placeholder="رمز عبور خود را وارد کنید"
          {...register("password")}
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
        {errors.password && (
          <p className="text-destructive mt-2">{errors.password.message}</p>
        )}
      </div>

      <Button
        type="submit"
        className="mt-6 w-full rounded-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? "در حال ورود" : "ورود"}
      </Button>
      <div>
        <CardFooter className="text-muted-foreground mt-4 flex flex-col items-center gap-4 pb-4 text-sm">
          <Link href="/sign-up">
            حساب کاربری ندارید؟{" "}
            <span className="text-primary hover:underline">ثبت‌نام کنید</span>
          </Link>
          <Link
            href={`/forgot-password${email ? `email=${encodeURIComponent(email)}` : ""}`}
            className="hover:underline"
          >
            رمز عبور را فراموش کرده‌اید؟
          </Link>
        </CardFooter>
      </div>
    </form>
  );
}
export default SignInForm;
