"use client";

import { useEffect, useState } from "react";

import { searchAdminAction } from "@/lib/actions/admin-search.actions";
import type { AdminSearchResult } from "@/types";
import { useDebounce } from "@/hooks/useDebounce";

type UseAdminSearchOptions = {
  enabled?: boolean;
  delay?: number;
};

export function useAdminSearch({
  enabled = true,
  delay = 400,
}: UseAdminSearchOptions = {}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<AdminSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const debouncedQuery = useDebounce(query, delay);

  useEffect(() => {
    if (!enabled) {
      setResults([]);
      setIsLoading(false);
      setOpen(false);
      return;
    }

    const normalizedQuery = debouncedQuery.trim();

    if (!normalizedQuery) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    async function search() {
      setIsLoading(true);

      try {
        const response = await searchAdminAction(normalizedQuery);

        if (cancelled) return;

        if (response.success) {
          setResults(response.data ?? []);
        } else {
          setResults([]);
        }
      } catch {
        if (!cancelled) {
          setResults([]);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void search();

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery, enabled]);

  const handleQueryChange = (value: string) => {
    setQuery(value);

    if (!value.trim()) {
      setResults([]);
      setOpen(false);
      return;
    }

    setOpen(true);
  };

  const handleFocus = () => {
    if (query.trim()) {
      setOpen(true);
    }
  };

  const closeSearch = () => {
    setOpen(false);
  };

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setOpen(false);
  };

  return {
    query,
    results,
    isLoading,
    open,
    setOpen,
    setQuery: handleQueryChange,
    handleFocus,
    closeSearch,
    clearSearch,
  };
}
