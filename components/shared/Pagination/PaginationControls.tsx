"use client";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationNext,
} from "@/components/ui/pagination";

type PaginationControlsProps = {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
};

function PaginationControls({
  totalPages,
  currentPage,
  onPageChange,
}: PaginationControlsProps) {
  if (totalPages < 1) {
    return null;
  }

  return (
    <Pagination className="mt-8 flex justify-center">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
            className={
              currentPage === 1
                ? "pointer-events-none cursor-pointer opacity-50"
                : ""
            }
          />
        </PaginationItem>
        {Array.from({ length: totalPages }).map((_, i) => (
          <PaginationItem key={i} className="cursor-pointer">
            <PaginationLink
              isActive={i + 1 === currentPage}
              onClick={() => onPageChange(i + 1)}
              className={
                i + 1 === currentPage
                  ? "bg-primary hover:bg-primary/90 text-white dark:bg-neutral-900 dark:hover:bg-neutral-700"
                  : ""
              }
            >
              {i + 1}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext
            onClick={() =>
              currentPage < totalPages && onPageChange(currentPage + 1)
            }
            className={
              currentPage === totalPages ? "pointer-events-none opacity-50" : ""
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

export default PaginationControls;
