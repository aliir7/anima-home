"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

// نام را تغییر دادیم تا برای پروژه‌ها، بلاگ‌ها و محصولات قابل استفاده باشد
export function useDataFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentCategory = searchParams.get("category");
  const currentSort = searchParams.get("sort");
  const currentPage = Number(searchParams.get("page") ?? 1);

  const createQueryString = useCallback(
    (name: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      if (name !== "page") {
        params.delete("page");
      }
      return params.toString();
    },
    [searchParams],
  );

  const setFilter = useCallback(
    (name: string, value: string | null) => {
      const queryString = createQueryString(name, value);
      router.push(`${pathname}?${queryString}`, { scroll: false });
    },
    [createQueryString, pathname, router],
  );

  return {
    currentCategory,
    currentSort,
    currentPage,
    setFilter,
  };
}
