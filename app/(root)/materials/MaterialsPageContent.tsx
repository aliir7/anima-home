"use client";

import BreadcrumbSection from "@/components/shared/BreadcrumbSection";
import ItemCard from "@/components/shared/Items/ItemCard";
import PaginationControls from "@/components/shared/Pagination/PaginationControls";
import { Material } from "@/types";
import { useRouter } from "next/navigation";
import { useState } from "react";

type MaterialsPageContent = {
  materials: Material[];
  currentPage: number;
  totalPages: number;
  basePath?: string;
};

function MaterialsPageContent({
  materials,
  currentPage,
  totalPages,
  basePath,
}: MaterialsPageContent) {
  const [page, setPage] = useState(currentPage);
  const router = useRouter();

  // pagination handler
  const onPageChange = (newPage: number) => {
    setPage(newPage);
    router.push(`${basePath}?page=${newPage}`);
  };
  return (
    <section className="wrapper space-y-8 py-8">
      <BreadcrumbSection
        items={[
          { label: "صفحه اصلی", href: "/" },
          { label: "متریال ها", href: "/materials" },
        ]}
      />
      <h2 className="mt-2 text-xl font-bold">متریال ها</h2>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {materials.map((mat) => (
          <ItemCard
            key={mat.id}
            title={mat.title}
            description={mat.description ?? ""}
            imageUrl={mat.image ?? ""}
            href={mat.pdfUrl}
            buttonText="نمایش کاتولوگ"
          />
        ))}
      </div>
      <PaginationControls
        currentPage={page}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </section>
  );
}

export default MaterialsPageContent;
