"use client";

import ClientWrapper from "@/components/shared/Wrapper/ClientWrapper";
import { Category, ProjectWithCategory } from "@/types";

type ProjectContentProps = {
  categories: Category[];
  projects: ProjectWithCategory[];
  selectedCategory: string;
  currentPage: number;
  totalPages: number;
};

function ProjectContent({
  categories,
  projects,
  selectedCategory,
  currentPage,
  totalPages,
}: ProjectContentProps) {
  return (
    <section className="wrapper space-y-6 py-8">
      <h2 className="text-xl font-bold">پروژه‌ها</h2>
      <ClientWrapper
        categories={categories}
        selectedCategory={selectedCategory}
        currentPage={currentPage}
        totalPages={totalPages}
        basePath="/projects"
        items={projects}
      />
    </section>
  );
}

export default ProjectContent;
