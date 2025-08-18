import ProjectTable from "@/components/shared/Admin/Projects/ProjectTable";
import { DYNAMIC_PAGES } from "@/lib/revalidate.config";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "پروژه‌ها",
};

export const dynamic = DYNAMIC_PAGES.ADMIN.dynamic;
export const revalidate = DYNAMIC_PAGES.ADMIN.revalidate;

function AdminProjectsPage() {
  return (
    <div>
      <div>
        <h2 className="mx-2 mb-6 text-xl font-semibold">لیست پروژه ها</h2>
      </div>
      <ProjectTable />
    </div>
  );
}

export default AdminProjectsPage;
