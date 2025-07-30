import { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import ResetPasswordForm from "./ResetPasswordForm";
import { verifyResetToken } from "@/lib/auth/verifyResetToken";

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
  const email = await verifyResetToken(token);

  if (!email) {
    redirect("/sign-in?error=token-expired");
  }

  return (
    <div className="mx-auto my-12 w-full max-w-md px-4">
      <h3 className="mb-6 text-center text-xl font-bold">تغییر رمز عبور</h3>
      <ResetPasswordForm email={email} token={token} />
    </div>
  );
}
