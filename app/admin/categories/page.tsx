import CategoryTable from "@/components/shared/Admin/Category/CategoryTable";
import { DYNAMIC_PAGES } from "@/lib/revalidate.config";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "دسته بندی ها",
};

export const dynamic = DYNAMIC_PAGES.ADMIN.dynamic;
export const revalidate = DYNAMIC_PAGES.ADMIN.revalidate;

function AdminCategoriesPage() {
  return (
    <div>
      <div>
        <h2 className="mx-2 mb-6 text-xl font-semibold">لیست پروژه ها</h2>
      </div>
      <CategoryTable />
    </div>
  );
}

export default AdminCategoriesPage;
