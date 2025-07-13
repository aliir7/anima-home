import { Suspense } from "react";
import ProjectTableSkeleton from "./ProjectTableSkeleton";
import ProjectTableClient from "./ProjectTableClient";
import { getAllCategories } from "@/db/queries/categoriesQueries";
import { getAllProjects } from "@/db/queries/projectQueries";

async function ProjectTable() {
  const categoriesResult = await getAllCategories();
  const projectsResult = await getAllProjects();

  return (
    <Suspense fallback={<ProjectTableSkeleton rows={5} />}>
      <ProjectTableClient
        categories={categoriesResult.success ? categoriesResult.data : []}
        projects={projectsResult.success ? projectsResult.data : []}
      />
    </Suspense>
  );
}

export default ProjectTable;
