"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FilterBar } from "../Filters/FilterBar";
import { Suspense } from "react";
import ItemListSkeleton from "../Items/ItemListSkeleton";
import ItemList from "../Items/ItemList";
import PaginationControls from "../Pagination/PaginationControls";
import { PAGE_SIZE } from "@/lib/constants";

type ClientWrapperProps = {
  categories: { id: string; name: string }[];
  selectedCategory: string;
  currentPage: number;
  totalPages: number;
  basePath: string; // مسیر پایه برای لینک‌ها
};

function ClientWrapper({
  categories,
  selectedCategory,
  currentPage,
  totalPages,
  basePath,
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
      <Suspense fallback={<ItemListSkeleton pageSize={PAGE_SIZE} />}>
        <ItemList category={category} page={page} basePath={basePath} />
      </Suspense>
      <PaginationControls
        totalPages={totalPages}
        currentPage={page}
        onPageChange={onPageChange}
      />
    </>
  );
}

export default ClientWrapper;
