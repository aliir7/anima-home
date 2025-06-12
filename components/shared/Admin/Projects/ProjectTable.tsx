import { Suspense } from "react";
import ProjectTableSkeleton from "./ProjectTableSkeleton";
import ProjectTableClient from "./ProjectTableClient";
import { getAllCategories } from "@/db/queries/categoriesQueries";
import { getAllProjects } from "@/db/queries/projectQueries";

async function ProjectTable() {
  const categoriesResult = await getAllCategories();
  const projectsResult = await getAllProjects();

  if (!categoriesResult.success || !projectsResult.success) {
    return (
      <p className="text-destructive text-center">خطا در بارگذاری داده ها</p>
    );
  }

  return (
    <Suspense fallback={<ProjectTableSkeleton rows={5} />}>
      <ProjectTableClient
        categories={categoriesResult.data}
        projects={projectsResult.data}
      />
    </Suspense>
  );
}

export default ProjectTable;
