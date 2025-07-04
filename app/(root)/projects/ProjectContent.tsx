"use client";

import ClientWrapper from "@/components/shared/Wrapper/ClientWrapper";
import { useSearchParams } from "next/navigation";

const categories = [
  { id: "1", name: "کمد" },
  { id: "2", name: "کابینت" },
  { id: "3", name: "تی وی وال" },
  { id: "4", name: "مارول شیت" },
];

function ProjectContent() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category") || "";
  const page = Number(searchParams.get("page") || "1");

  const totalItems = 50;
  const pageSize = 6;
  const totalPages = Math.ceil(totalItems / pageSize);

  return (
    <section className="wrapper space-y-6 py-8">
      <h2 className="text-xl font-bold">پروژه‌ها</h2>
      <ClientWrapper
        categories={categories}
        selectedCategory={category}
        currentPage={page}
        totalPages={totalPages}
        basePath="/projects"
      />
    </section>
  );
}

export default ProjectContent;
