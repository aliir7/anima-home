import { Metadata } from "next";
import { services } from "@/lib/constants";
import ComingSoon from "@/components/shared/ComingSoon";

const pageTitle = services.at(2)?.title;

export const metadata: Metadata = {
  title: pageTitle || "محصولات",
};

export const revalidate = 3600; // 1hour

function ProductsPage() {
  return (
    <section className="wrapper py-12">
      <ComingSoon />
    </section>
  );
}

export default ProductsPage;
