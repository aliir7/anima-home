import ProjectTable from "@/components/shared/Admin/Projects/ProjectTable";
import { getAllCategories } from "@/db/queries/categoriesQueries";
import { getAllProjects, getProjectsCount } from "@/db/queries/projectQueries";
import { PAGE_SIZE } from "@/lib/constants";
import { Category, ProjectWithCategory } from "@/types";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "پروژه‌ها",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

type AdminProjectsPageProps = {
  searchParams: Promise<{ id?: string; page?: string }>;
};

async function AdminProjectsPage({ searchParams }: AdminProjectsPageProps) {
  const page = (await searchParams)?.page ?? 1;
  const currentPage = Number(page);
  const projectsId = (await searchParams).id ?? "";
  const [categoriesResult, projectsResult, totalCount] = await Promise.all([
    getAllCategories(),
    getAllProjects({ page: currentPage, pageSize: PAGE_SIZE }),
    getProjectsCount(projectsId),
  ]);
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const categories: Category[] = categoriesResult.success
    ? categoriesResult.data
    : [];
  const projects: ProjectWithCategory[] = projectsResult.success
    ? projectsResult.data
    : [];
  return (
    <div>
      <div>
        <h2 className="mx-2 mb-6 text-xl font-semibold">لیست پروژه ها</h2>
      </div>
      <ProjectTable
        projects={projects}
        categories={categories}
        currentPage={currentPage}
        totalPage={totalPages}
      />
    </div>
  );
}

export default AdminProjectsPage;
