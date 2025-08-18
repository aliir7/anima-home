import ComingSoon from "@/components/shared/ComingSoon";
import { DYNAMIC_PAGES } from "@/lib/revalidate.config";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "تنظیمات",
};

export const dynamic = DYNAMIC_PAGES.ADMIN.dynamic;
export const revalidate = DYNAMIC_PAGES.ADMIN.revalidate;

function AdminToolsPage() {
  return (
    <section className="wrapper py-12">
      <ComingSoon />
    </section>
  );
}

export default AdminToolsPage;
