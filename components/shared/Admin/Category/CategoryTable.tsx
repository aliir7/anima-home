import { Suspense } from "react";
import { getAllCategories } from "@/db/queries/categoriesQueries";
import CategoryTableSkeleton from "./CategoryTableSkeleton";
import CategoryTableClient from "./CategoryTableClient";

async function CategoryTable() {
  const result = await getAllCategories();

  return (
    <Suspense fallback={<CategoryTableSkeleton rows={5} />}>
      <CategoryTableClient categories={result.success ? result.data : []} />
    </Suspense>
  );
}

export default CategoryTable;
