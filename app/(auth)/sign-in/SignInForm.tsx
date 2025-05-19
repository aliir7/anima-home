"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useActionState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

function SignInForm() {
  // const [data, action] = useActionState(signupAction, {
  //   success: false,
  //   message: "",
  // });

  // const {
  //   register,
  //   formState: { errors },
  // } = useForm<SignupSchemaType>({
  //   resolver: zodResolver(signupSchema),
  // });

  return (
    <form className="space-y-6">
      <div>
        <Label htmlFor="email">ایمیل</Label>
        <Input
          id="email"
          type="email"
          className="my-4 rounded-full"
          name="email"
        />
        {/* {errors.email && (
          <p className="text-destructive text-sm">{errors.email.message}</p>
        )} */}
      </div>

      <div>
        <Label htmlFor="password">رمز عبور</Label>
        <Input
          id="password"
          type="password"
          className="my-4 rounded-full"
          name="password"
        />
        {/* {errors.password && (
          <p className="text-destructive text-sm">{errors.password.message}</p>
        )} */}
      </div>

      {/* 
      {state.message && (
        <p
          className={`${state.success ? "text-green-600" : "text-red-600"} text-sm`}
        >
          {state.message}
        </p>
      )} */}

      <Button type="submit" className="mt-6 w-full rounded-full">
        ثبت‌نام
      </Button>
    </form>
  );
}
export default SignInForm;
