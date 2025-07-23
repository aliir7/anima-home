import { Metadata } from "next";
import ProjectContent from "./ProjectContent";
import {
  getFilteredProjects,
  getProjectsCount,
} from "@/db/queries/projectQueries";
import { getAllCategories } from "@/db/queries/categoriesQueries";
import { PAGE_SIZE } from "@/lib/constants";

export const metadata: Metadata = { title: "پروژه‌ها" };

type ProjectPageProps = {
  searchParams: Promise<{ category?: string; page?: string }>;
};

async function ProjectsPage({ searchParams }: ProjectPageProps) {
  const page = (await searchParams)?.page ?? 1;
  const currentPage = Number(page);
  const category = (await searchParams).category ?? "";
  const [categoriesRes, projectsRes, totalCount] = await Promise.all([
    getAllCategories(),
    getFilteredProjects({
      categoryId: category,
      page: currentPage,
      pageSize: PAGE_SIZE,
    }),
    getProjectsCount(category),
  ]);
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  if (!categoriesRes.success || !projectsRes.success) {
    return <p>خطا در دریافت اطلاعات</p>;
  }

  return (
    <ProjectContent
      categories={categoriesRes.data ?? []}
      projects={projectsRes.data ?? []}
      selectedCategory={category}
      currentPage={currentPage}
      totalPages={totalPages}
    />
  );
}

export default ProjectsPage;
