import BreadcrumbSection from "@/components/shared/BreadcrumbSection";
import ShopContent from "@/components/shared/Shop/ShopContent";
import sampleData from "@/db/sampleData";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "فروشگاه",
  description: "هرآنچه باید از تیم آنیماهوم بخرید",
};

export default function ShopPage() {
  const sampleProducts = sampleData.products;
  const productId = sampleProducts.map((item) => item.product.id);

  return (
    <section className="wrapper space-y-6 py-8">
      <BreadcrumbSection
        items={[{ label: "صفحه اصلی", href: "/" }, { label: "فروشگاه" }]}
      />

      <h2 className="mt-2 text-xl font-bold">فروشگاه آنیماهوم</h2>

      {/* ✅ تمام منطق فروشگاه */}
      <ShopContent items={sampleProducts} />
    </section>
  );
}
