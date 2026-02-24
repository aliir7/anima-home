"use client";

import { Category, ProjectWithCategory } from "@/types";
import ItemCard from "../Items/ItemCard";
import PaginationControls from "../Pagination/PaginationControls";
import { useDataFilters } from "@/hooks/useDataFilters";
import FilterDropdown from "../Filters/FilterDropDown";

type ClientWrapperProps = {
  categories: Category[];
  selectedCategory: string;
  currentPage: number;
  totalPages: number;
  basePath: string;
  items: ProjectWithCategory[];
};
const SORT_OPTIONS = [
  { label: "جدیدترین", value: "latest" },
  { label: "قدیمی‌ترین", value: "oldest" },
];

function ClientWrapper({
  categories,
  currentPage,
  totalPages,
  basePath,
  items,
}: ClientWrapperProps) {
  const { currentCategory, currentSort, setFilter } = useDataFilters();

  const categoryOptions = categories.map((c) => ({
    label: c.name,
    value: c.id,
  }));

  return (
    <>
      <div className="flex flex-col justify-between gap-4 rounded-full px-4 py-6 md:flex-row md:items-center dark:bg-neutral-950">
        <div className="flex gap-3">
          {/* استفاده مجدد برای دسته‌بندی پروژه‌ها */}
          <FilterDropdown
            title="دسته‌بندی پروژه‌ها"
            placeholder="همه پروژه‌ها"
            options={categoryOptions}
            currentValue={currentCategory}
            onChange={(val) => setFilter("category", val)}
          />
        </div>
      </div>{" "}
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <ItemCard
            key={item.id}
            title={item.title}
            description={item.description!}
            showDescription={true}
            buttonText="مشاهده بیشتر"
            imageUrl={item.images?.[0] || "/placeholder.svg"}
            href={`${basePath}/${item.seoSlug}`}
          />
        ))}
      </div>
      <PaginationControls
        totalPages={totalPages}
        currentPage={currentPage}
        basePath={basePath}
      />
    </>
  );
}

export default ClientWrapper;
