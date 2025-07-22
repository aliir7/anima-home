import { Suspense } from "react";
import ProjectTableSkeleton from "./ProjectTableSkeleton";
import ProjectTableClient from "./ProjectTableClient";
import { getAllCategories } from "@/db/queries/categoriesQueries";
import { getAllProjects } from "@/db/queries/projectQueries";
import { Category, ProjectWithCategory } from "@/types";

async function ProjectTable() {
  const categoriesResult = await getAllCategories();
  const projectsResult = await getAllProjects();

  const categories: Category[] = categoriesResult.success
    ? categoriesResult.data
    : [];
  const projects: ProjectWithCategory[] = projectsResult.success
    ? projectsResult.data
    : [];

  return (
    <Suspense fallback={<ProjectTableSkeleton rows={5} />}>
      <ProjectTableClient categories={categories} projects={projects} />
    </Suspense>
  );
}

export default ProjectTable;
