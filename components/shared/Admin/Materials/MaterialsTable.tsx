import { Suspense } from "react";
import MaterialsTableSkeleton from "./MaterialsTableSkeleton";
import MaterialTableClient from "./MaterialTableClient";
import { Material } from "@/types";

type MaterialsTableProps = {
  materials: Material[];
  currentPage: number;
  totalPages: number;
};

async function MaterialsTable({
  materials,
  currentPage,
  totalPages,
}: MaterialsTableProps) {
  return (
    <Suspense fallback={<MaterialsTableSkeleton rows={6} />}>
      <MaterialTableClient
        materials={materials}
        currentPage={currentPage}
        totalPages={totalPages}
        basePath="/admin/materials"
      />
    </Suspense>
  );
}

export default MaterialsTable;
