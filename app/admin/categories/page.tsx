import { Metadata } from "next";
import {
  getAllProductCategories,
  getAllProjectCategories,
} from "@/db/queries/categoriesQueries";

import ProjectCategoryTable from "@/components/shared/Admin/Category/ProjectCategoryTable";
import ProductCategoriesTable from "@/components/shared/Admin/Category/ProductCategoriesTable";

export const metadata: Metadata = {
  title: "دسته بندی ها",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminCategoriesPage() {
  const projectResult = await getAllProjectCategories();
  const productResult = await getAllProductCategories();
  const projectCategories = projectResult.success ? projectResult.data : [];
  const productCategories = productResult.success ? productResult.data : [];
  return (
    <div>
      <div>
        <h2 className="mx-2 mb-6 text-xl font-semibold">
          لیست دسته بندی پروژه ها
        </h2>
      </div>

      {/* ✅ Project */}
      <ProjectCategoryTable categories={projectCategories} />

      <div className="mx-2 mt-8 mb-6 text-xl font-semibold">
        <h2>لیست دسته بندی محصولات</h2>
      </div>

      {/* ✅ Product */}
      <ProductCategoriesTable categories={productCategories} />
    </div>
  );
}
