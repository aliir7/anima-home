import { AdminMaterialCard } from "@/components/shared/Admin/Materials/AdminMaterialCard";
import MaterialForm from "@/components/shared/Admin/Materials/MaterialsForm";
import { getAllMaterials } from "@/lib/actions/materials.actions";
import { Material } from "@/types";
import { Metadata } from "next/types";

export const metadata: Metadata = {
  title: "متریال",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function AdminMaterialsPage() {
  const materialsResult = await getAllMaterials();
  if (!materialsResult.success) {
    return <p>خطا در دریافت اطلاعات</p>;
  }
  const materials: Material[] = materialsResult.success
    ? materialsResult.data
    : [];

  return (
    <section className="wrapper py-12">
      <h1 className="mb-2 text-xl font-bold">مدیریت متریال‌ها</h1>
      <MaterialForm />

      {materials.length > 0 && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {materials.map((mat) => (
            <AdminMaterialCard
              key={mat.id}
              id={mat.id}
              title={mat.title}
              description={mat.description ?? ""}
              image={mat.image ?? ""}
              pdfUrl={mat.pdfUrl}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default AdminMaterialsPage;
