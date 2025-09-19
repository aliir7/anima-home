import MaterialsTable from "@/components/shared/Admin/Materials/MaterialsTable";
import {
  getAllMaterials,
  getMaterialsCount,
} from "@/db/queries/materialsQueries";
import { PAGE_SIZE } from "@/lib/constants";
import { Material } from "@/types";
import { Metadata } from "next/types";

export const metadata: Metadata = {
  title: "متریال",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

type AdminMaterialsPageProps = {
  searchParams: Promise<{ id?: string; page?: string }>;
};

async function AdminMaterialsPage({ searchParams }: AdminMaterialsPageProps) {
  const page = (await searchParams)?.page ?? 1;
  const currentPage = Number(page);
  const materialsId = (await searchParams).id ?? "";
  const [materialsResult, totalCount] = await Promise.all([
    getAllMaterials({ page: currentPage, pageSize: PAGE_SIZE }),
    getMaterialsCount(materialsId),
  ]);
  const materials: Material[] = materialsResult.success
    ? materialsResult.data
    : [];

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);
  if (!materialsResult.success) {
    return <p>خطا در دریافت اطلاعات</p>;
  }

  return (
    <section>
      <div>
        <h2 className="mx-2 mb-6 text-xl font-semibold">لیست متریال‌ها</h2>
      </div>
      <MaterialsTable
        materials={materials}
        currentPage={currentPage}
        totalPages={totalPages}
      />
    </section>
  );
}

export default AdminMaterialsPage;
