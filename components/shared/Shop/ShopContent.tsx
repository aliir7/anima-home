"use client";

import { CategoryWithParent, ProductWithRelations } from "@/types";
import ProductCard from "./Product/ProductCard";
import { useDataFilters } from "@/hooks/useDataFilters";
import FilterDropdown from "../Filters/FilterDropDown";
import PaginationControls from "../Pagination/PaginationControls";

type Props = {
  items: ProductWithRelations[];
  categories: CategoryWithParent[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
};

const SORT_OPTIONS = [
  { label: "جدیدترین", value: "latest" },
  { label: "قدیمی‌ترین", value: "oldest" },
  { label: "ارزان‌ترین", value: "price-asc" },
  { label: "گران‌ترین", value: "price-desc" },
];

export default function ShopContent({
  items,
  categories,
  totalPages,
  totalItems,
  currentPage,
}: Props) {
  const { currentCategory, currentSort, setFilter } = useDataFilters();

  // تبدیل دسته‌بندی‌ها به فرمت مورد نیاز دراپ‌داون
  const categoryOptions = categories.map((c) => ({
    label: c.name,
    value: c.id,
  }));

  return (
    <div className="space-y-8">
      {/* Toolbar */}
      <div className="bg-card flex flex-col gap-4 rounded-full border px-8 py-6 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          {/* Category Filter */}
          <FilterDropdown
            title="دسته‌بندی"
            placeholder="همه دسته‌ها"
            options={categoryOptions}
            currentValue={currentCategory}
            onChange={(val) => setFilter("category", val)}
          />

          {/* Sort Filter */}
          <FilterDropdown
            title="مرتب‌سازی"
            placeholder="پیش‌فرض"
            options={SORT_OPTIONS}
            currentValue={currentSort}
            onChange={(val) => setFilter("sort", val)}
          />
        </div>

        {/* Count */}
        <p className="text-muted-foreground text-sm">
          نمایش{" "}
          <span className="text-foreground font-medium">{items.length}</span> از{" "}
          {totalItems} محصول
        </p>
      </div>

      {/* Grid */}
      {items.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => (
            <ProductCard
              key={item.id}
              product={item}
              href={`/shop/products/${item.seoSlug}`}
            />
          ))}
        </div>
      ) : (
        <div className="bg-muted/40 flex min-h-100 flex-col items-center justify-center rounded-lg border border-dashed text-center">
          <h3 className="text-xl font-bold tracking-tight">محصولی یافت نشد</h3>
          <p className="text-muted-foreground mt-1 text-sm">
            فیلتر خود را تغییر دهید و دوباره امتحان کنید.
          </p>
        </div>
      )}

      {/* Pagination (Uncomment when ready) */}
      {totalPages > 1 && (
        <div className="flex justify-center pt-8">
          <PaginationControls
            totalPages={totalPages}
            currentPage={currentPage}
          />
        </div>
      )}
    </div>
  );
}
