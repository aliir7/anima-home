import Link from "next/link";
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Metadata } from "next";
import SignInForm from "./SignInForm";
import logoImg from "/public/logo/logo-mini-2.png";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DYNAMIC_PAGES } from "@/lib/revalidate.config";

export const metadata: Metadata = {
  title: "ورود",
};

export const dynamic = DYNAMIC_PAGES.AUTH.dynamic;
export const revalidate = DYNAMIC_PAGES.AUTH.revalidate;

type SignInPageProps = {
  searchParams: Promise<{ callbackUrl?: string; verified?: string }>;
};

async function SignInPage({ searchParams }: SignInPageProps) {
  // get session for redirect user to home page
  const { callbackUrl = "/", verified } = await searchParams;
  const session = await auth();

  if (session) {
    redirect(callbackUrl);
  }
  return (
    <div className="mx-auto my-12 w-full max-w-md px-4">
      <Card className="rounded-2xl border shadow-xl">
        <CardHeader className="text-center">
          <Link href="/" className="mb-4 inline-block">
            <Image
              src={logoImg}
              alt="Anima Home Logo"
              width={120}
              height={40}
              className="mx-auto"
              priority
            />
          </Link>
          <CardTitle className="mb-4 text-xl font-semibold md:text-2xl">
            ورود به حساب
          </CardTitle>
        </CardHeader>

        <CardContent>
          <SignInForm verified={verified === "1"} />
        </CardContent>
      </Card>
    </div>
  );
}

export default SignInPage;
