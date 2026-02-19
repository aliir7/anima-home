// فایل: app/(root)/products/ShopContent.tsx

"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { CategoryWithParent, ProductWithRelations } from "@/types";
import ProductCard from "./Product/ProductCard";
import PaginationControls from "../Pagination/PaginationControls";

type Props = {
  items: ProductWithRelations[];
  categories: CategoryWithParent[];
  totalPages: number;
  totalItems: number;
};

// const SORTS = ["جدیدترین", "قدیمی‌ترین", "ارزان‌ترین", "گران‌ترین"] as const;

export default function ShopContent({
  items,
  categories,
  totalPages,
  totalItems,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // خواندن مقادیر فعلی فیلتر از URL
  const currentCategory = searchParams.get("category");
  // const currentSort = searchParams.get("sort") ?? "جدیدترین";

  // تابع هوشمند برای ساخت URL جدید با حفظ پارامترهای قبلی
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      // وقتی فیلتر عوض میشه، به صفحه اول برگرد
      if (name !== "page") {
        params.delete("page");
      }
      return params.toString();
    },
    [searchParams],
  );

  const handleCategoryChange = (categoryId: string | null) => {
    const queryString = createQueryString("category", categoryId ?? "");
    router.push(`${pathname}?${queryString}`);
  };

  return (
    <div className="space-y-8">
      {/* Toolbar */}
      <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="flex flex-wrap items-center gap-3">
          {/* Category Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2 rounded-full">
                {currentCategory
                  ? categories.find((c) => c.id === currentCategory)?.name
                  : "همه دسته‌ها"}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => handleCategoryChange(null)}>
                همه دسته‌ها
              </DropdownMenuItem>
              {categories.map((cat) => (
                <DropdownMenuItem
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                >
                  {cat.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* TODO: Sort Dropdown can be added here in the same way */}
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
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <ProductCard
              key={item.id}
              product={item}
              href={`/shop/products/${item.seoSlug}`}
            />
          ))}
        </div>
      ) : (
        <div className="flex min-h-100 flex-col items-center justify-center rounded-lg border border-dashed text-center">
          <h3 className="text-xl font-bold tracking-tight">محصولی یافت نشد</h3>
          <p className="text-muted-foreground text-sm">
            فیلتر خود را تغییر دهید و دوباره امتحان کنید.
          </p>
        </div>
      )}

      {/* Pagination */}
      {/* {totalPages > 1 && (
        <div className="flex justify-center pt-8">
          <PaginationControls totalPages={+totalPages} currentPage={1} />
        </div> */}
      {/* )} */}
    </div>
  );
}
