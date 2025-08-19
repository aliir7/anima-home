import ComingSoon from "@/components/shared/ComingSoon";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "تنظیمات",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

function AdminSettingsPage() {
  return (
    <section className="wrapper py-12">
      <ComingSoon />
    </section>
  );
}

export default AdminSettingsPage;
