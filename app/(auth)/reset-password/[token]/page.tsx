import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/auth/authGuard";
import ResetPasswordForm from "./ResetPasswordForm";

export const metadata: Metadata = {
  title: "تغییر رمز عبور",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

type ResetPasswordPageProps = {
  params: Promise<{ token: string }>;
};

async function ResetPasswordPage({ params }: ResetPasswordPageProps) {
  // اگر کاربر از قبل وارد شده، نیازی به این صفحه ندارد
  const session = await getCurrentSession();
  if (session) {
    redirect("/");
  }

  const { token } = await params;

  // توجه: برخلاف قبل، اینجا دیگر توکن را از قبل اعتبارسنجی نمی‌کنیم.
  // خود auth.api.resetPassword (که در changePasswordAction فراخوانی
  // می‌شود) توکن را هنگام ارسال فرم بررسی می‌کند و در صورت نامعتبر/
  // منقضی بودن، پیام خطای مناسب را نشان می‌دهد.
  return (
    <div className="mx-auto my-12 w-full max-w-md px-4">
      <h3 className="mb-6 text-center text-xl font-bold">تغییر رمز عبور</h3>
      <ResetPasswordForm token={token} />
    </div>
  );
}

export default ResetPasswordPage;
