"use client";

import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@/components/ui/popover";

import { MIN_SEARCH_LENGTH, useAdminSearch } from "@/hooks/useAdminSearch";
import { cn } from "@/lib/utils/utils";

import AdminSearchResults from "./AdminSearchResults";
import AdminSearchTrigger from "./AdminSearchTrigger";

function AdminSearch() {
  const {
    query,
    results,
    isLoading,
    open,
    isExpanded,
    selectedIndex,
    isSearchable,
    pathname,
    inputRef,
    resultsRef,
    groupedResults,
    types,
    setOpen,
    setQuery,
    expand,
    collapse,
    handleFocus,
    handleBlur,
    handleKeyDown,
    handleSubmit,
    handleItemClick,
  } = useAdminSearch({
    enabled: true,
    delay: 400,
  });

  if (!isSearchable) {
    return null;
  }

  const showResults = open && query.trim().length >= MIN_SEARCH_LENGTH;

  return (
    <Popover open={showResults} onOpenChange={setOpen}>
      <PopoverAnchor asChild>
        <div className="relative flex items-center">
          <AdminSearchTrigger
            isExpanded={isExpanded}
            query={query}
            isLoading={isLoading}
            isOpen={showResults}
            pathname={pathname}
            inputRef={inputRef}
            onExpand={expand}
            onCollapse={collapse}
            onQueryChange={setQuery}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            onSubmit={handleSubmit}
          />
        </div>
      </PopoverAnchor>

      <PopoverContent
        align="end"
        side="bottom"
        sideOffset={8}
        dir="rtl"
        className={cn(
          "flex w-[min(90vw,25rem)] flex-col overflow-hidden",
          "max-h-[min(70vh,28rem)] rounded-xl p-0",
          // ✅ دارک‌مود: توکن‌های تم + سایه متناسب با تم
          "border-border/60 bg-popover text-popover-foreground",
          "dark:border-border/40 shadow-lg dark:shadow-black/30",
        )}
        onOpenAutoFocus={(event) => {
          event.preventDefault();
        }}
      >
        <AdminSearchResults
          results={results}
          groupedResults={groupedResults}
          types={types}
          isLoading={isLoading}
          query={query}
          selectedIndex={selectedIndex}
          resultsRef={resultsRef}
          onItemClick={handleItemClick}
        />
      </PopoverContent>
    </Popover>
  );
}

export default AdminSearch;
