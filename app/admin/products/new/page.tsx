import ProductForm from "@/components/shared/Admin/Products/ProductForm";
import { getAllProductCategories } from "@/db/queries/categoriesQueries";

export default async function NewProductPage() {
  // دریافت لیست دسته‌بندی‌ها برای سلکت‌باکس
  const allCategories = await getAllProductCategories();
  const result = allCategories.success ? allCategories.data : [];
  const [id, name] = result;
  return (
    <div className="mx-auto max-w-5xl py-10">
      <ProductForm categories={result} />
    </div>
  );
}
