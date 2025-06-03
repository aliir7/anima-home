import { dummyProjects } from "@/db/sampleData";
import { Suspense } from "react";
import ProjectTableSkeleton from "./ProjectTableSkeleton";
import ProjectTableClient from "./ProjectTableClient";

function ProjectTable() {
  const projects = dummyProjects;

  return (
    <Suspense fallback={<ProjectTableSkeleton rows={5} />}>
      <ProjectTableClient projects={projects} />{" "}
    </Suspense>
  );
}

export default ProjectTable;
