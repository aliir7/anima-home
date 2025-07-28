"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { changePasswordSchema } from "@/lib/validations/usersValidations";
import { showSuccessToast, showErrorToast } from "@/lib/utils/showToastMessage";
import { changePasswordAction } from "@/lib/actions/auth.actions";
import { ChangePasswordValues } from "@/types";
import Link from "next/link";

type ResetPasswordProps = {
  email: string;
  token: string;
};

function ResetPasswordForm({ email, token }: ResetPasswordProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
  });
  const [success, setSuccess] = useState(false);
  const onSubmit = async (data: ChangePasswordValues) => {
    const result = await changePasswordAction(email, token, data.password);
    if (result.success) {
      showSuccessToast("رمز عبور با موفقیت تغییر کرد", "bottom-right");
      setSuccess(true);
    } else if (!result.success && result.error.type === "custom") {
      showErrorToast(
        result.error?.message || "خطا در تغییر رمز",
        "bottom-right",
      );
    }
  };
  if (success) {
    return (
      <div className="p-4 text-center">
        <p className="mb-4">
          رمز عبور با موفقیت تغییر کرد. اکنون می‌توانید وارد شوید.
        </p>
        <Link href="/sign-in" className="text-blue-600 underline">
          صفحه ورود
        </Link>
      </div>
    );
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <Label htmlFor="password">رمز عبور جدید</Label>
        <Input
          id="password"
          type="password"
          placeholder="رمز عبور جدید را وارد کنید"
          {...register("password")}
          disabled={isSubmitting}
          className="mt-2 rounded-full"
        />
        {errors.password && (
          <p className="text-destructive mt-1 text-sm">
            {errors.password.message}
          </p>
        )}
      </div>
      <div>
        <Label htmlFor="confirmPassword">تأیید رمز عبور جدید</Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="رمز عبور را مجدداً وارد کنید"
          {...register("confirmPassword")}
          disabled={isSubmitting}
          className="mt-2 rounded-full"
        />
        {errors.confirmPassword && (
          <p className="text-destructive mt-1 text-sm">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>
      <Button
        type="submit"
        className="w-full rounded-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? "در حال ذخیره..." : "تغییر رمز عبور"}
      </Button>
    </form>
  );
}
export default ResetPasswordForm;
