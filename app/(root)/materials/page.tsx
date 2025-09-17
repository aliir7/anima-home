import { Metadata } from "next";
import { services } from "@/lib/constants";
import { getAllMaterials } from "@/lib/actions/materials.actions";
import { Material } from "@/types";
import ItemCard from "@/components/shared/Items/ItemCard";
import BreadcrumbSection from "@/components/shared/BreadcrumbSection";

const pageTitle = services.at(1)?.title;

export const revalidate = 86400; // 1 day

export const metadata: Metadata = {
  title: pageTitle || "متریال",
};

async function MaterialsPage() {
  const materialsResult = await getAllMaterials();
  if (!materialsResult.success) {
    return (
      <p className="wrapper text-destructive space-y-6 py-6 text-xl font-bold">
        {materialsResult.error}
      </p>
    );
  }

  if (materialsResult.success && materialsResult.data.length === 0) {
    return (
      <p className="wrapper text-destructive space-y-6 py-6 text-xl font-bold">
        فعلا متریالی موجود نیست
      </p>
    );
  }

  const materials: Material[] = materialsResult.data;
  return (
    <section className="wrapper space-y-8 py-8">
      <BreadcrumbSection
        items={[
          { label: "صفحه اصلی", href: "/" },
          { label: "متریال ها", href: "/materials" },
        ]}
      />
      <h2 className="mt-2 text-xl font-bold">متریال ها</h2>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {materials.map((mat) => (
          <ItemCard
            key={mat.id}
            title={mat.title}
            description={mat.description ?? ""}
            imageUrl={mat.image ?? ""}
            href={mat.pdfUrl}
            buttonText="نمایش کاتولوگ"
          />
        ))}
      </div>
    </section>
  );
}

export default MaterialsPage;
