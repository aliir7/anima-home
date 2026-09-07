"use client";

import { ArrowLeft, Loader2, Search } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@/components/ui/popover";
import { useAdminSearch } from "@/hooks/useAdminSearch";
import { AdminSearchResult } from "@/types";

const SEARCHABLE_ADMIN_ROUTES = [
  "/admin/orders",
  "/admin/users",
  "/admin/products",
  "/admin/coupons",
  "/admin/materials",
  "/admin/projects",
];

function AdminSearch() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isSearchable = SEARCHABLE_ADMIN_ROUTES.includes(pathname);

  const {
    query,
    results,
    isLoading,
    open,
    setOpen,
    setQuery,
    handleFocus,
    closeSearch,
  } = useAdminSearch({
    enabled: isSearchable,
    delay: 400,
  });

  /*
   * Sync query with the current URL.
   *
   * This keeps the input synchronized when:
   * - user submits the search
   * - pagination/navigation changes query
   * - browser back/forward is used
   */
  useEffect(() => {
    setQuery(searchParams.get("query") ?? "");
  }, [searchParams]);

  if (!isSearchable) {
    return null;
  }

  const handleSubmit = () => {
    closeSearch();
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverAnchor asChild>
        <form
          id="admin-search-form"
          action={pathname}
          method="GET"
          onSubmit={handleSubmit}
          dir="rtl"
          className="relative"
        >
          <div
            className={[
              "relative flex items-center",
              "w-44 transition-[width] duration-300 ease-out",
              "focus-within:w-65 md:w-52 md:focus-within:w-80",
              "lg:w-65 lg:focus-within:w-100",
            ].join(" ")}
          >
            <Search
              aria-hidden="true"
              className="text-muted-foreground pointer-events-none absolute top-1/2 right-3 z-10 size-4 -translate-y-1/2"
            />

            <Input
              type="search"
              name="query"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onFocus={handleFocus}
              placeholder="جستجو..."
              dir="rtl"
              autoComplete="off"
              aria-label="جستجو در پنل مدیریت"
              aria-expanded={open}
              className={[
                "h-10 w-full rounded-full",
                "bg-background/80 backdrop-blur-sm",
                "pr-9 pl-10",
                "text-right text-sm",
                "outline-light dark:outline-dark",
                "placeholder:text-xs",
                "shadow-sm",
                "transition-shadow duration-200",
                "focus-visible:ring-2",
              ].join(" ")}
            />

            {isLoading ? (
              <Loader2
                aria-hidden="true"
                className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 z-10 size-4 -translate-y-1/2 animate-spin"
              />
            ) : null}

            <Button
              type="submit"
              variant="ghost"
              size="icon"
              className="sr-only"
              tabIndex={-1}
            >
              <Search className="size-4" />
              <span className="sr-only">جستجو</span>
            </Button>
          </div>
        </form>
      </PopoverAnchor>

      <PopoverContent
        align="end"
        side="bottom"
        sideOffset={8}
        dir="rtl"
        className="w-[min(90vw,25rem)] overflow-hidden rounded-xl p-0 shadow-lg"
        onOpenAutoFocus={(event) => {
          event.preventDefault();
        }}
      >
        {isLoading ? (
          <div className="text-muted-foreground flex items-center justify-center gap-2 px-4 py-7 text-sm">
            <Loader2 className="size-4 animate-spin" />
            <span>در حال جستجو...</span>
          </div>
        ) : results.length > 0 ? (
          <div className="max-h-80 overflow-y-auto">
            <div className="px-2 py-2">
              {results.map((result: AdminSearchResult) => (
                <Link
                  key={`${result.type}-${result.id}`}
                  href={result.href}
                  onClick={closeSearch}
                  className={[
                    "group flex items-center gap-3 rounded-lg px-3 py-3",
                    "text-right outline-none",
                    "transition-colors",
                    "hover:bg-accent",
                    "focus-visible:bg-accent",
                  ].join(" ")}
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {result.title}
                    </p>

                    {result.description ? (
                      <p className="text-muted-foreground mt-1 truncate text-xs">
                        {result.description}
                      </p>
                    ) : null}
                  </div>

                  <ArrowLeft
                    aria-hidden="true"
                    className="text-muted-foreground group-hover:text-foreground size-4 shrink-0 transition-transform group-hover:-translate-x-0.5"
                  />
                </Link>
              ))}
            </div>

            <div className="bg-muted/30 border-t px-3 py-2">
              <Button
                type="submit"
                form="admin-search-form"
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground w-full justify-center gap-1.5 text-xs"
              >
                <span>مشاهده همه نتایج</span>
                <ArrowLeft className="size-3.5" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-muted-foreground px-4 py-7 text-center text-sm">
            <Search className="mx-auto mb-2 size-5 opacity-50" />
            <p>نتیجه‌ای پیدا نشد.</p>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

export default AdminSearch;
