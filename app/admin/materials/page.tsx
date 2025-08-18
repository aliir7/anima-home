import ComingSoon from "@/components/shared/ComingSoon";
import { DYNAMIC_PAGES } from "@/lib/revalidate.config";
import { Metadata } from "next/types";

export const metadata: Metadata = {
  title: "متریال",
};

export const dynamic = DYNAMIC_PAGES.ADMIN.dynamic;
export const revalidate = DYNAMIC_PAGES.ADMIN.revalidate;

function AdminMaterialsPage() {
  return (
    <section className="wrapper py-12">
      <ComingSoon />
    </section>
  );
}

export default AdminMaterialsPage;
