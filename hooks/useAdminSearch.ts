"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useDebounce } from "@/hooks/useDebounce";
import { searchAdminAction } from "@/lib/actions/admin-search.actions";
import type { AdminSearchResult } from "@/types";

const SEARCHABLE_ADMIN_ROUTES = [
  "/admin/orders",
  "/admin/users",
  "/admin/products",
  "/admin/coupons",
  "/admin/materials",
  "/admin/projects",
];

export const MIN_SEARCH_LENGTH = 3;

type UseAdminSearchOptions = {
  enabled?: boolean;
  delay?: number;
};

export function useAdminSearch({
  enabled = true,
  delay = 400,
}: UseAdminSearchOptions = {}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<AdminSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const isSearchable = SEARCHABLE_ADMIN_ROUTES.includes(pathname);
  const debouncedQuery = useDebounce(query, delay);

  // همگام‌سازی با URL
  useEffect(() => {
    const urlQuery = searchParams.get("query") ?? "";
    setQuery(urlQuery);
    if (urlQuery.trim()) setIsExpanded(true);
  }, [searchParams]);

  // جستجوی زنده
  useEffect(() => {
    if (!enabled || !isSearchable) {
      setResults([]);
      setIsLoading(false);
      setOpen(false);
      return;
    }

    const normalized = debouncedQuery.trim();
    if (!normalized) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    async function search() {
      setIsLoading(true);
      try {
        const response = await searchAdminAction(normalized);
        if (cancelled) return;
        setResults(response.success ? (response.data ?? []) : []);
      } catch {
        if (!cancelled) setResults([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    void search();
    return () => {
      cancelled = true;
    };
  }, [debouncedQuery, enabled, isSearchable]);

  // ریست انتخاب هنگام تغییر نتایج
  useEffect(() => {
    setSelectedIndex(results.length > 0 ? 0 : -1);
  }, [results]);

  // اسکرول به آیتم انتخاب‌شده
  useEffect(() => {
    if (selectedIndex >= 0 && resultsRef.current) {
      const items = resultsRef.current.querySelectorAll("[data-search-item]");
      items[selectedIndex]?.scrollIntoView({ block: "nearest" });
    }
  }, [selectedIndex]);

  // گروه‌بندی نتایج
  const groupedResults = useMemo(() => {
    return results.reduce<
      Record<AdminSearchResult["type"], AdminSearchResult[]>
    >(
      (acc, item) => {
        (acc[item.type] ??= []).push(item);
        return acc;
      },
      {} as Record<AdminSearchResult["type"], AdminSearchResult[]>,
    );
  }, [results]);

  const types = useMemo(
    () => Object.keys(groupedResults) as AdminSearchResult["type"][],
    [groupedResults],
  );

  // باز کردن اینپوت از حالت آیکون + فوکوس خودکار
  const expand = useCallback(() => {
    setIsExpanded(true);
    requestAnimationFrame(() => inputRef.current?.focus());
  }, []);

  // بستن کامل و پاک‌سازی
  const collapse = useCallback(() => {
    setIsExpanded(false);
    setOpen(false);
    setResults([]);
    setQuery("");
  }, []);

  const handleQueryChange = useCallback((value: string) => {
    setQuery(value);
    if (!value.trim()) {
      setResults([]);
      setOpen(false);
      return;
    }
    setOpen(true);
  }, []);

  const handleFocus = useCallback(() => {
    if (query.trim()) setOpen(true);
  }, [query]);

  // جمع‌شدن به حالت آیکون فقط وقتی اینپوت خالی است و نتایجی باز نیست
  const handleBlur = useCallback(() => {
    setTimeout(() => {
      if (!query.trim() && !open) setIsExpanded(false);
    }, 150);
  }, [query, open]);

  const handleSubmit = useCallback(() => setOpen(false), []);

  const handleItemClick = useCallback(() => {
    setOpen(false);
    setIsExpanded(false);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Escape") {
        if (open) setOpen(false);
        else if (!query.trim()) collapse();
        return;
      }

      if (!open || results.length === 0) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) => (prev + 1) % results.length);
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex(
            (prev) => (prev - 1 + results.length) % results.length,
          );
          break;
        case "Enter":
          e.preventDefault();
          if (selectedIndex >= 0 && selectedIndex < results.length) {
            window.location.href = results[selectedIndex].href;
            setOpen(false);
            setIsExpanded(false);
          } else {
            handleSubmit();
          }
          break;
      }
    },
    [open, results, selectedIndex, query, collapse, handleSubmit],
  );

  return {
    // State
    query,
    results,
    isLoading,
    open,
    isExpanded,
    selectedIndex,
    isSearchable,
    pathname,
    // Refs
    inputRef,
    resultsRef,
    // Computed
    groupedResults,
    types,
    // Setters
    setOpen,
    setQuery: handleQueryChange,
    // Handlers
    expand,
    collapse,
    handleFocus,
    handleBlur,
    handleKeyDown,
    handleSubmit,
    handleItemClick,
  };
}
