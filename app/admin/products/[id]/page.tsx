import ProductForm from "@/components/shared/Admin/Products/ProductForm";
import { getProductById } from "@/lib/actions/product.actions";
import { getAllProductCategories } from "@/db/queries/categoriesQueries";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth/authGuard";

export default async function AdminProductUpdatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  requireAdmin();
  // ۱. دریافت محصول (دقت کنید خروجی ActionResult است)
  const productRes = await getProductById(id);

  // ۲. اگر عملیات موفق نبود یا دیتایی نداشتیم -> صفحه 404
  if (!productRes.success || !productRes.data) {
    return notFound();
  }

  // ۳. استخراج دیتای واقعی محصول
  const product = productRes.data;

  // ۴. دریافت دسته‌بندی‌ها از کوئری موجود
  const categoriesRes = await getAllProductCategories();
  const categories = categoriesRes.success
    ? categoriesRes.data.map((c) => ({ id: c.id, name: c.name }))
    : [];

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <h1 className="h2-bold text-2xl font-bold">
        ویرایش محصول: {product.title}
      </h1>

      <ProductForm
        type="Update"
        product={product}
        productId={product.id}
        categories={categories}
      />
    </div>
  );
}
