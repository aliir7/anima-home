import ProductForm from "@/components/shared/Admin/Products/ProductForm";
import { getAllProductCategories } from "@/db/queries/categoriesQueries";
import { categories } from "@/db/schema";
import { desc } from "drizzle-orm";

export default async function NewProductPage() {
  // دریافت لیست دسته‌بندی‌ها برای سلکت‌باکس
  const allCategories = await getAllProductCategories();
  const result = allCategories.success ? allCategories.data : [];
  return (
    <div className="mx-auto max-w-5xl py-10">
      <ProductForm categories={result} />
    </div>
  );
}
