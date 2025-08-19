import CategoryTable from "@/components/shared/Admin/Category/CategoryTable";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "دسته بندی ها",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

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
