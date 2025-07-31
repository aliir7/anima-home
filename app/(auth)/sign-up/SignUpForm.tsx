"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { SignupFormValues } from "@/types";
import { signupFormSchema } from "@/lib/validations/usersValidations";
import { showErrorToast, showSuccessToast } from "@/lib/utils/showToastMessage";
import { signupAction } from "@/lib/actions/auth.actions";
import { useSearchParams, useRouter } from "next/navigation";

export default function SignUpForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupFormSchema),
    mode: "onTouched",
  });

  //submit handler function
  const onSubmit = async (data: SignupFormValues) => {
    const result = await signupAction(data);

    if (result.success) {
      showSuccessToast(
        "تبت نام با موفقیت انجام شد",
        "top-right",
        "ایمیل فعالسازی برای شما ارسال شد",
      );
      router.push(callbackUrl);
    }
    if (!result.success && result.error.type === "custom") {
      showErrorToast(result.error.message, "top-right");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="name">نام</Label>
        <Input
          id="name"
          {...register("name")}
          className="outline-light dark:outline-dark mt-4 rounded-full"
          placeholder="نام و نام خانوادگی"
        />
        {errors.name && (
          <p className="text-destructive mt-2">{errors.name.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="email">ایمیل</Label>
        <Input
          id="email"
          type="email"
          {...register("email")}
          className="outline-light dark:outline-dark mt-4 rounded-full"
          placeholder="name@example.com"
        />
        {errors.email && (
          <p className="text-destructive mt-2 text-sm">
            {errors.email.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="password">رمز عبور</Label>
        <Input
          id="password"
          type="password"
          {...register("password")}
          className="outline-light dark:outline-dark mt-4 rounded-full"
          placeholder="رمزعبور حداقل باید 6 کاراکتر داشته باشد"
        />
        {errors.password && (
          <p className="text-destructive mt-2 text-sm">
            {errors.password.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="confirmPassword">تکرار رمز عبور</Label>
        <Input
          id="confirmPassword"
          type="password"
          {...register("confirmPassword")}
          className="outline-light dark:outline-dark mt-4 rounded-full"
          placeholder="رمزعبور حداقل باید 6 کاراکتر داشته باشد"
        />
        {errors.confirmPassword && (
          <p className="text-destructive mt-2 text-sm">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="mt-4 w-full rounded-full"
      >
        {isSubmitting ? "در حال ارسال..." : "ثبت‌نام"}
      </Button>
    </form>
  );
}
