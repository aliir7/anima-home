import { Metadata } from "next";
import { getSiteSettings } from "@/lib/actions/settings.actions";
import { requireAdmin } from "@/lib/auth/authGuard";
import SettingsForm from "@/components/shared/Admin/Settings/SettingsForm";

export const metadata: Metadata = {
  title: "تنظیمات",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function AdminSettingsPage() {
  await requireAdmin();
  const settings = await getSiteSettings();

  return (
    <section className="space-y-6">
      <h2 className="text-primary text-xl font-semibold dark:text-neutral-100">
        تنظیمات سایت
      </h2>
      <SettingsForm initialValues={settings} />
    </section>
  );
}

export default AdminSettingsPage;
