import { Metadata } from "next";
import ComingSoon from "@/components/shared/ComingSoon";

export const metadata: Metadata = {
  title: "پنل مدیریت / محصولات",
};

function AdminProductsPage() {
  return (
    <section className="wrapper py-12">
      <ComingSoon />
    </section>
  );
}

export default AdminProductsPage;
