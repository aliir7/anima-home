// فایل: app/(root)/products/page.tsx

import { Metadata } from "next";
import { getAllProductCategories } from "@/db/queries/categoriesQueries";
import { getAllProducts, getProductsCount } from "@/db/queries/productQueries";
import BreadcrumbSection from "@/components/shared/BreadcrumbSection";
import { PAGE_SIZE } from "@/lib/constants";
import { ProductWithRelations } from "@/types";
import ShopContent from "@/components/shared/Shop/ShopContent";

export const metadata: Metadata = {
  title: "فروشگاه",
  description: "هرآنچه باید از تیم آنیماهوم بخرید",
};

// این صفحه از سرور رندر می‌شود و می‌تواند از Caching بهره ببرد
export const revalidate = 3600; // 1hour

// تعریف تایپ برای searchParams برای خوانایی بیشتر
type ProductsPageProps = {
  searchParams: Promise<{
    category?: string;
    page?: string;
    sort?: string;
  }>;
};

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  // 1. خواندن پارامترها از URL
  const page = (await searchParams)?.page ?? 1;
  const currentPage = Number(page);

  const categoryId = (await searchParams).category ?? "";

  // 2. واکشی همزمان داده‌های مورد نیاز
  const [categoriesRes, productsRes, totalProductsCount] = await Promise.all([
    getAllProductCategories(), // برای نمایش لیست فیلتر دسته‌بندی‌ها
    getAllProducts({
      page: currentPage,
      pageSize: PAGE_SIZE,
      categoryId: categoryId, // فیلتر را به کوئری اصلی پاس می‌دهیم
    }),
    getProductsCount(categoryId), // تعداد کل را هم با فیلتر حساب می‌کنیم
  ]);

  // 3. محاسبه تعداد کل صفحات برای Pagination
  const totalPages = Math.ceil(totalProductsCount / PAGE_SIZE);

  // 4. استخراج داده‌ها از نتایج
  const products = productsRes.success ? productsRes.data : [];
  const categories = categoriesRes.success ? categoriesRes.data : [];

  return (
    <section className="wrapper space-y-6 py-8">
      <BreadcrumbSection
        items={[{ label: "صفحه اصلی", href: "/" }, { label: "فروشگاه" }]}
      />

      <h2 className="mt-2 text-xl font-bold">فروشگاه آنیماهوم</h2>

      {/* 
        تمام داده‌های مورد نیاز به کامپوننت کلاینت پاس داده می‌شود
        تا UI را رندر کرده و لینک‌های صحیح برای فیلتر و صفحه‌بندی بسازد.
      */}
      <ShopContent
        items={products ?? []}
        categories={categories}
        totalPages={totalPages}
        totalItems={totalProductsCount}
        currentPage={currentPage}
      />
    </section>
  );
}
