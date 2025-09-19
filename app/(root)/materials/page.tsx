import { Metadata } from "next";
import { PAGE_SIZE, services } from "@/lib/constants";
import {
  getAllMaterials,
  getMaterialsCount,
} from "@/db/queries/materialsQueries";
import { Material } from "@/types";
import MaterialsPageContent from "./MaterialsPageContent";

const pageTitle = services.at(1)?.title;

export const revalidate = 86400; // 1 day

export const metadata: Metadata = {
  title: pageTitle || "متریال",
};

type MaterialsPageProps = {
  searchParams: Promise<{ id?: string; page?: string }>;
};

async function MaterialsPage({ searchParams }: MaterialsPageProps) {
  const page = (await searchParams)?.page ?? 1;
  const currentPage = Number(page);
  const materialsId = (await searchParams).id ?? "";
  const [materialsResult, totalCount] = await Promise.all([
    getAllMaterials({ page: currentPage, pageSize: PAGE_SIZE }),
    getMaterialsCount(materialsId),
  ]);
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
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);
  return (
    <MaterialsPageContent
      materials={materials}
      currentPage={currentPage}
      totalPages={totalPages}
      basePath="/materials"
    />
  );
}

export default MaterialsPage;
