import { Metadata } from "next";
import Image from "next/image";
import logoImg from "/public/logo/logo-mini.png";

import SignUpForm from "./SignUpForm";
import {
  CardTitle,
  CardFooter,
  Card,
  CardHeader,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Link } from "lucide-react";

export const metadata: Metadata = {
  title: "ثبت‌ نام ",
};

function SignUpPage() {
  return (
    <div className="mx-auto w-full max-w-md">
      <Card suppressHydrationWarning={true}>
        <CardHeader className="flex-center space-y-4">
          <Image
            src={logoImg}
            priority={true}
            alt="logo"
            width={100}
            height={100}
          />
        </CardHeader>
        <CardTitle className="text-center">به ما بپیوندید</CardTitle>
        <CardDescription className="text-center font-semibold">
          برای ثبت نام اطلاعات خود را وارد کنید
        </CardDescription>
        <CardContent className="space-y-4">
          <SignUpForm />
        </CardContent>
      </Card>
    </div>
  );
}

export default SignUpPage;
