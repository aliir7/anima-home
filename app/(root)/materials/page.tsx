import { Metadata } from "next";
import { services } from "@/lib/constants";
import { getMaterials } from "@/lib/actions/materials.actions";
import { MaterialCard } from "@/components/shared/Materials/MaterialsCard";

const pageTitle = services.at(1)?.title;

export const revalidate = 86400; // 1 day

export const metadata: Metadata = {
  title: pageTitle || "متریال",
  robots: {
    index: false,
    follow: false,
  },
};

async function MaterialsPage() {
  const materials = await getMaterials();
  return (
    <section className="wrapper py-12">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {materials.map((mat) => (
          <MaterialCard
            key={mat.id}
            title={mat.title}
            description={mat.description ?? ""}
            image={mat.image ?? ""}
            pdfUrl={mat.pdfUrl}
          />
        ))}
      </div>
    </section>
  );
}

export default MaterialsPage;
