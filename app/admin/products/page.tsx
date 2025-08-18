import { Metadata } from "next";
import ComingSoon from "@/components/shared/ComingSoon";
import { DYNAMIC_PAGES } from "@/lib/revalidate.config";

export const metadata: Metadata = {
  title: "محصولات",
};

export const dynamic = DYNAMIC_PAGES.ADMIN.dynamic;
export const revalidate = DYNAMIC_PAGES.ADMIN.revalidate;

function AdminProductsPage() {
  return (
    <section className="wrapper py-12">
      <ComingSoon />
    </section>
  );
}

export default AdminProductsPage;
