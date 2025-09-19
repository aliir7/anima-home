import { Suspense } from "react";
import ProjectTableSkeleton from "./ProjectTableSkeleton";
import ProjectTableClient from "./ProjectTableClient";
import { Category, ProjectWithCategory } from "@/types";

type ProjectTableProps = {
  projects: ProjectWithCategory[];
  categories: Category[];
  currentPage: number;
  totalPage: number;
};

function ProjectTable({
  projects,
  categories,
  currentPage,
  totalPage,
}: ProjectTableProps) {
  return (
    <Suspense fallback={<ProjectTableSkeleton rows={6} />}>
      <ProjectTableClient
        categories={categories}
        projects={projects}
        currentPage={currentPage}
        totalPages={totalPage}
        basePath="/admin/projects"
      />
    </Suspense>
  );
}

export default ProjectTable;
