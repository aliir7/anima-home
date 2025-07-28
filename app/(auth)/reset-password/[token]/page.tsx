import { Metadata } from "next";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { verificationTokens } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import ResetPasswordForm from "./ResetPasswordForm";

export const metadata: Metadata = {
  title: "تغییر رمز عبور",
};

type ResetPasswordPageProps = {
  params: Promise<{ token: string }>;
};

export default async function ResetPasswordPage({
  params,
}: ResetPasswordPageProps) {
  // if user logged in redirect to homepage
  const session = await auth();
  if (session) {
    redirect("/");
  }
  const { token } = await params;
  const tokenEntry = await db.query.verificationTokens.findFirst({
    where: eq(verificationTokens.token, token),
  });
  if (!tokenEntry || new Date(tokenEntry.expires) < new Date()) {
    redirect("/sign-in?error=token-expired");
  }
  return (
    <div className="mx-auto my-12 w-full max-w-md px-4">
      <h3 className="mb-6 text-center text-xl font-bold">تغییر رمز عبور</h3>
      <ResetPasswordForm email={tokenEntry.identifier} token={token} />
    </div>
  );
}
