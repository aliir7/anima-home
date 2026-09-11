import { Metadata } from "next";
import { redirect } from "next/navigation";

import ChangePhoneForm from "@/components/shared/Account/ChangePhoneForm";
import { getCurrentSession } from "@/lib/auth/authGuard";

export const metadata: Metadata = {
  title: "مدیریت شماره موبایل",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function PhoneSettingsPage() {
  const session = await getCurrentSession();
  if (!session?.user) {
    redirect("/");
  }

  return (
    <section className="space-y-6">
      <h2 className="text-primary text-xl font-semibold dark:text-neutral-100">
        مدیریت شماره موبایل
      </h2>

      <ChangePhoneForm
        currentPhone={session.user.phoneNumber ?? null}
        phoneVerified={!!session.user.phoneNumberVerified}
      />
    </section>
  );
}

export default PhoneSettingsPage;
