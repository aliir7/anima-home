"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationNext,
} from "@/components/ui/pagination";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

type PaginationControlsProps = {
  totalPages: number;
  currentPage: number; // نام پراپ را با صفحه‌ی والد هماهنگ کنید (معمولاً page است)
  onPageChange?: (page: number) => void;
  basePath?: string;
  urlParamName?: string; // امکان تغییر نام پارامتر در URL (پیش‌فرض page)
};

function PaginationControls({
  totalPages,
  currentPage,
  onPageChange,
  basePath,
  urlParamName = "page",
}: PaginationControlsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // محاسبه شماره صفحه فعلی (در صورتی که currentPage پاس داده نشود، از URL می‌خواند)
  const page = currentPage || Number(searchParams.get(urlParamName)) || 1;

  // تابع ایجاد URL جدید با حفظ سایر پارامترها (مثل query)
  const createPageUrl = useCallback(
    (pageNumber: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(urlParamName, pageNumber.toString());
      return `${basePath || "?"}?${params.toString()}`;
    },
    [searchParams, basePath, urlParamName],
  );

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;

    // اگر متد دستی پاس داده شده (برای حالت کلاینت کامل)
    if (onPageChange) {
      onPageChange(newPage);
      return;
    }

    // اگر مسیر پایه وجود دارد (برای حالت سرور و مسیریابی)
    if (basePath) {
      router.push(createPageUrl(newPage));
    }
  };

  if (totalPages <= 1) return null;

  // منطق نمایش صفحات (بدون تغییر)
  const MAX_VISIBLE = 5;
  let start = Math.max(1, page - 2);
  let end = Math.min(totalPages, start + MAX_VISIBLE - 1);

  if (end - start < MAX_VISIBLE - 1) {
    start = Math.max(1, end - MAX_VISIBLE + 1);
  }

  const visiblePages = Array.from(
    { length: end - start + 1 },
    (_, i) => start + i,
  );

  return (
    <Pagination className="mt-8 flex justify-center">
      <PaginationContent className="gap-2">
        {/* دکمه قبلی */}
        <PaginationItem>
          <PaginationPrevious
            onClick={() => handlePageChange(page - 1)}
            className={`${
              page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"
            } rounded-full`}
          />
        </PaginationItem>

        {/* صفحه اول */}
        {start > 1 && (
          <>
            <PaginationItem>
              <PaginationLink
                onClick={() => handlePageChange(1)}
                className="cursor-pointer rounded-full"
              >
                1
              </PaginationLink>
            </PaginationItem>
            {start > 2 && (
              <PaginationItem className="opacity-70">...</PaginationItem>
            )}
          </>
        )}

        {/* صفحات میانی */}
        {visiblePages.map((p) => {
          const isActive = p === page;
          return (
            <PaginationItem key={p}>
              <PaginationLink
                isActive={isActive}
                onClick={() => handlePageChange(p)}
                className={`cursor-pointer rounded-full transition-colors ${
                  isActive
                    ? "bg-primary hover:bg-primary/90 text-white dark:bg-neutral-900 dark:hover:bg-neutral-700"
                    : "hover:bg-muted"
                }`}
              >
                {p}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        {/* صفحه آخر */}
        {end < totalPages && (
          <>
            {end < totalPages - 1 && (
              <PaginationItem className="opacity-70">...</PaginationItem>
            )}
            <PaginationItem>
              <PaginationLink
                onClick={() => handlePageChange(totalPages)}
                className="cursor-pointer rounded-full"
              >
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          </>
        )}

        {/* دکمه بعدی */}
        <PaginationItem>
          <PaginationNext
            onClick={() => handlePageChange(page + 1)}
            className={`${
              page === totalPages
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            } rounded-full`}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

export default PaginationControls;
