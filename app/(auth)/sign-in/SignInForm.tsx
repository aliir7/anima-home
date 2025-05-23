"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { SigninValues } from "@/types";
import { signinSchema } from "@/lib/validations/usersValidations";
import { showErrorToast, showSuccessToast } from "@/lib/utils/showToastMessage";
import { signinWithCredentials } from "@/lib/actions/auth.actions";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const router = useRouter();

  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = useForm<SigninValues>({
    resolver: zodResolver(signinSchema),
    mode: "onSubmit",
  });

  // sigIn handler action
  const onSubmit = async (data: SigninValues) => {
    const result = await signinWithCredentials(data);
    if (result.success) {
      showSuccessToast(result.data);
      router.push(callbackUrl);
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
        {errors.email && (
          <p className="text-destructive mt-2">{errors.email.message}</p>
        )}
      </div>

      <div className="relative">
        <Label htmlFor="password">رمز عبور</Label>
        <Input
          id="password"
          type={showPassword ? "text" : "password"}
          className="my-4 rounded-full"
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
    </form>
  );
}
export default SignInForm;
