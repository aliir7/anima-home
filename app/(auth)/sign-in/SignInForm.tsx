"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { SigninValues } from "@/types";
import { signinSchema } from "@/lib/validations/usersValidations";
import { showErrorToast, showSuccessToast } from "@/lib/utils/showToastMessage";
import { signinWithCredentials } from "@/lib/actions/auth.actions";

function SignInForm() {
  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = useForm<SigninValues>({
    resolver: zodResolver(signinSchema),
  });

  // sigIn handler action
  const onSubmit = async (data: SigninValues) => {
    const result = await signinWithCredentials(data);
    if (result.success) {
      showSuccessToast(result.data);
    }
    if (!result.success && result.error.type === "custom") {
      showErrorToast(result.error.message);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <Label htmlFor="email">ایمیل</Label>
        <Input
          id="email"
          type="email"
          className="my-4 rounded-full"
          placeholder="ایمیل خود را وارد کنید"
          {...register("email")}
        />
        {errors.password &&
          showErrorToast(errors.email?.message || "ایمیل وارد شده صحیح نیست")}
      </div>

      <div>
        <Label htmlFor="password">رمز عبور</Label>
        <Input
          id="password"
          type="password"
          className="my-4 rounded-full"
          placeholder="رمز عبور خود را وارد کنید"
          {...register("password")}
        />
        {errors.password &&
          showErrorToast(errors.password.message || "رمز وارد شده صحیح نیست")}
      </div>

      <Button
        type="submit"
        className="mt-6 w-full rounded-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? "در حال ورود" : "ورود"}
      </Button>
    </form>
  );
}
export default SignInForm;
