"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Category, ProjectWithCategory } from "@/types";
import { FilterBar } from "../Filters/FilterBar";
import ItemCard from "../Items/ItemCard";
import PaginationControls from "../Pagination/PaginationControls";

type ClientWrapperProps = {
  categories: Category[];
  selectedCategory: string;
  currentPage: number;
  totalPages: number;
  basePath: string;
  items: ProjectWithCategory[];
};

function ClientWrapper({
  categories,
  selectedCategory,
  currentPage,
  totalPages,
  basePath,
  items,
}: ClientWrapperProps) {
  const router = useRouter();
  const [category, setCategory] = useState(selectedCategory);
  const [page, setPage] = useState(currentPage);
  const onCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    setPage(1);
    router.push(`${basePath}?category=${newCategory}&page=1`);
  };
  const onPageChange = (newPage: number) => {
    setPage(newPage);
    router.push(`${basePath}?category=${category}&page=${newPage}`);
  };
  return (
    <>
      <FilterBar
        categories={categories}
        selected={category}
        onChange={onCategoryChange}
      />
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <ItemCard
            key={item.id}
            title={item.title}
            description={item.description!}
            showDescription={true}
            buttonText="مشاهده بیشتر"
            imageUrl={item.images?.[0] || "/placeholder.svg"}
            href={`${basePath}/${item.slug}`}
          />
        ))}
      </div>
      <PaginationControls
        totalPages={totalPages}
        currentPage={page}
        onPageChange={onPageChange}
      />
    </>
  );
}

export default ClientWrapper;
