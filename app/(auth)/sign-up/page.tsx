import { Metadata } from "next";
import Image from "next/image";
import logoImg from "/public/logo/logo-mini-2.png";

import SignUpForm from "./SignUpForm";
import {
  CardTitle,
  CardFooter,
  Card,
  CardHeader,
  CardContent,
} from "@/components/ui/card";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "ثبت‌ نام ",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

type SignUpPageProps = {
  searchParams: Promise<{ callbackUrl: string }>;
};

async function SignUpPage({ searchParams }: SignUpPageProps) {
  // get session for redirect user to home page
  const { callbackUrl } = await searchParams;
  const session = await auth();

  if (session) {
    redirect(callbackUrl || "/");
  }
  return (
    <div className="mx-auto my-8 w-full max-w-md px-4">
      <Card className="rounded-2xl border shadow-xl">
        <CardHeader className="text-center">
          <Link href="/" className="mb-4 inline-block">
            <Image
              src={logoImg}
              alt="Anima Home Logo"
              width={120}
              height={40}
              className="mx-auto bg-transparent"
              priority={true}
            />
          </Link>
          <CardTitle className="text-xl font-semibold md:text-2xl">
            به ما بپیوندید
          </CardTitle>
        </CardHeader>

        <CardContent>
          <SignUpForm />
        </CardContent>

        <CardFooter className="text-muted-foreground mt-2 flex justify-center pb-4 text-sm">
          <Link href="/sign-in">
            قبلاً حساب دارید؟{" "}
            <span className="text-primary hover:underline dark:hover:text-neutral-300">
              وارد شوید
            </span>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}

export default SignUpPage;
