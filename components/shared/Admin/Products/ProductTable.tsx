import { ProjectWithCategory, Category, ProductWithRelations } from "@/types";
import { Suspense } from "react";
import ProductTableClient from "./ProductTableClient";
import ProjectTableSkeleton from "../Projects/ProjectTableSkeleton";

type ProductTableProps = {
  products: ProductWithRelations[] | undefined;
  categories: Category[];
  currentPage: number;
  totalPage: number;
};

function ProductTable({
  products,
  categories,
  currentPage,
  totalPage,
}: ProductTableProps) {
  return (
    <Suspense fallback={<ProjectTableSkeleton rows={6} />}>
      <ProductTableClient
        categories={categories}
        product={products ?? []}
        currentPage={currentPage}
        totalPages={totalPage}
        basePath="/admin/products"
      />
    </Suspense>
  );
}

export default ProductTable;
