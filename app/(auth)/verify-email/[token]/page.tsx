// app/(auth)/verify-email/[token]/page.tsx
import { verifyEmailByToken } from "@/lib/auth/verifyEmailByToken";
import { DYNAMIC_PAGES } from "@/lib/revalidate.config";
import { redirect } from "next/navigation";

type VerifyEmailPageProps = {
  params: Promise<{ token: string }>;
};

export const dynamic = DYNAMIC_PAGES.AUTH.dynamic;
export const revalidate = DYNAMIC_PAGES.AUTH.revalidate;

export default async function VerifyEmailPage({
  params,
}: VerifyEmailPageProps) {
  const { token } = await params;

  const result = await verifyEmailByToken(token);

  if (result.success) {
    redirect("/sign-in?verified=1");
  }

  return <div className="p-8 text-center text-red-600">{result.message}</div>;
}
