"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useFormState } from "react-dom";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

function SignUpForm() {
  // const [state, formAction] = useFormState(signupAction, {
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
    <form className="space-y-5">
      <div>
        <Label htmlFor="name">نام</Label>
        <Input id="name" />
        {/* {errors.name && (
          <p className="text-destructive text-sm">{errors.name.message}</p>
    */}
      </div>

      <div>
        <Label htmlFor="email">ایمیل</Label>
        <Input id="email" type="email" />
        {/* {errors.email && (
          <p className="text-destructive text-sm">{errors.email.message}</p>
        )} */}
      </div>

      <div>
        <Label htmlFor="password">رمز عبور</Label>
        {/* <Input id="password" type="password" {...register("password")} />
        {errors.password && (
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

      <Button type="submit" className="w-full">
        ثبت‌نام
      </Button>
    </form>
  );
}
export default SignUpForm;
