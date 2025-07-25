import ProjectTable from "@/components/shared/Admin/Projects/ProjectTable";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "پنل مدیریت / پروژه‌ها",
};
export const dynamic = "force-dynamic";
export const revalidate = 0;

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
