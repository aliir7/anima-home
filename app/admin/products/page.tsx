import { Metadata } from "next";
import ComingSoon from "@/components/shared/ComingSoon";

export const metadata: Metadata = {
  title: "محصولات",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

function AdminProductsPage() {
  return (
    <section className="wrapper py-12">
      <ComingSoon />
    </section>
  );
}

export default AdminProductsPage;
