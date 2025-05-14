import { Metadata } from "next";
import Image from "next/image";

import SignUpForm from "./SignUpForm";
import { CardFooter, Card, CardHeader } from "@/components/ui/card";
import { Link } from "lucide-react";

export const metadata: Metadata = {
  title: "ثبت‌نام ",
};

function SignUpPage() {
  return (
    <div className="max-wmd mx-auto w-full">
      <Card>
        <CardHeader>
          <Link href="/">
            <Image
              src="/public/logo/logo-mini.png"
              priority={true}
              alt="logo"
              width={100}
              height={100}
            />
          </Link>
        </CardHeader>
      </Card>
    </div>
  );
}

export default SignUpPage;
