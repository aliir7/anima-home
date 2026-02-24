import ProductForm from "@/components/shared/Admin/Products/ProductForm";
import { getProductById } from "@/lib/actions/product.actions";
// در صورت داشتن اکشن دریافت دسته‌بندی‌ها آن را ایمپورت کنید
// import { getAllCategories } from "@/lib/actions/category.actions";
import { notFound } from "next/navigation";

export default async function AdminProductUpdatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // ۱. دریافت محصول (دقت کنید خروجی ActionResult است)
  const productRes = await getProductById(id);

  // ۲. اگر عملیات موفق نبود یا دیتایی نداشتیم -> صفحه 404
  if (!productRes.success || !productRes.data) {
    return notFound();
  }

  // ۳. استخراج دیتای واقعی محصول
  const product = productRes.data;

  // ۴. دریافت دسته‌بندی‌ها (باید اکشن خود را اینجا صدا بزنید)
  // فرض می‌کنیم اکشن شما لیستی از دسته‌بندی‌ها برمی‌گرداند
  // const categoriesRes = await getAllCategories();
  // const categories = categoriesRes.success ? categoriesRes.data : [];

  // فعلا برای جلوگیری از ارور، یک آرایه خالی پاس می‌دهیم. (شما با دیتای واقعی جایگزین کنید)
  const categories: { id: string; name: string }[] = [];

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
