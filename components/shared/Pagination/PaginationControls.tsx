"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationNext,
} from "@/components/ui/pagination";
import { useRouter } from "next/navigation";

type PaginationControlsProps = {
  totalPages: number;
  currentPage: number;
  onPageChange?: (page: number) => void;
  basePath?: string;
};

function PaginationControls({
  totalPages,
  currentPage,
  onPageChange,
  basePath,
}: PaginationControlsProps) {
  const router = useRouter();

  if (totalPages <= 1) return null;

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;

    if (onPageChange) return onPageChange(page);
    if (basePath) return router.push(`${basePath}?page=${page}`);

    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "PaginationControls: either onPageChange or basePath must be provided",
      );
    }
  };

  // 🔹 نمایش محدوده صفحات محدود (برای مثال 5 صفحه)
  const MAX_VISIBLE = 5;
  let start = Math.max(1, currentPage - 2);
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
        {/* قبلی */}
        <PaginationItem>
          <PaginationPrevious
            onClick={() => goToPage(currentPage - 1)}
            className={`${
              currentPage === 1
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            } rounded-full`}
          />
        </PaginationItem>

        {/* صفحه اول در صورت مخفی بودن */}
        {start > 1 && (
          <>
            <PaginationItem>
              <PaginationLink
                onClick={() => goToPage(1)}
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

        {/* صفحات اصلی */}
        {visiblePages.map((page) => {
          const isActive = page === currentPage;

          return (
            <PaginationItem key={page}>
              <PaginationLink
                aria-current={isActive ? "page" : undefined}
                isActive={isActive}
                onClick={() => goToPage(page)}
                className={`cursor-pointer rounded-full transition-colors ${
                  isActive
                    ? "bg-primary hover:bg-primary/90 text-white dark:bg-neutral-900 dark:hover:bg-neutral-700"
                    : "hover:bg-muted"
                }`}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        {/* صفحه آخر در صورت مخفی بودن */}
        {end < totalPages && (
          <>
            {end < totalPages - 1 && (
              <PaginationItem className="opacity-70">...</PaginationItem>
            )}
            <PaginationItem>
              <PaginationLink
                onClick={() => goToPage(totalPages)}
                className="cursor-pointer rounded-full"
              >
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          </>
        )}

        {/* بعدی */}
        <PaginationItem>
          <PaginationNext
            onClick={() => goToPage(currentPage + 1)}
            className={`${
              currentPage === totalPages
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
