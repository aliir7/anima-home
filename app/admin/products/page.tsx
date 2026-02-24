import { Metadata } from "next";
import { getAllProductCategories } from "@/db/queries/categoriesQueries";
import { getAllProducts, getProductsCount } from "@/db/queries/productQueries";
import { PAGE_SIZE } from "@/lib/constants";
import ProductTable from "@/components/shared/Admin/Products/ProductTable";

export const metadata: Metadata = {
  title: "محصولات",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

type AdminProductsPageProps = {
  searchParams: Promise<{ id?: string; page?: string }>;
};

async function AdminProductsPage({ searchParams }: AdminProductsPageProps) {
  const page = (await searchParams)?.page ?? 1;
  const currentPage = Number(page);
  const projectsId = (await searchParams).id ?? "";
  const [categoriesResult, productsResult, totalCount] = await Promise.all([
    getAllProductCategories(),
    getAllProducts({ page: currentPage, pageSize: PAGE_SIZE }),
    getProductsCount(projectsId),
  ]);
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const categories = categoriesResult.success ? categoriesResult.data : [];
  const products = productsResult.success ? productsResult.data : undefined;
  return (
    <div>
      <div>
        <h2 className="mx-2 mb-6 text-xl font-semibold">لیست محصولات</h2>
      </div>
      <ProductTable
        products={products}
        categories={categories}
        currentPage={currentPage}
        totalPage={totalPages}
      />
    </div>
  );
}

export default AdminProductsPage;
