import { Metadata } from "next";
import { redirect } from "next/navigation";

import ChangeEmailForm from "@/components/shared/Account/ChangeEmailForm";
import { getCurrentSession } from "@/lib/auth/authGuard";

export const metadata: Metadata = {
  title: "مدیریت ایمیل",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function EmailSettingsPage() {
  const session = await getCurrentSession();
  if (!session?.user) {
    redirect("/");
  }

  return (
    <section className="space-y-6">
      <h2 className="text-primary text-xl font-semibold dark:text-neutral-100">
        مدیریت ایمیل
      </h2>

      <ChangeEmailForm
        currentEmail={session.user.email}
        emailVerified={session.user.emailVerified}
      />
    </section>
  );
}

export default EmailSettingsPage;
