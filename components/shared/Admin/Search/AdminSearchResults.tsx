"use client";

import {
  ArrowLeft,
  FolderKanban,
  Layers,
  Loader2,
  Package,
  Search,
  ShoppingBag,
  Ticket,
  Users,
} from "lucide-react";
import Link from "next/link";
import type { RefObject } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/utils";
import type { AdminSearchResult } from "@/types";

// ============================================================
// تنظیمات آیکون و رنگ برای هر نوع نتیجه
// ============================================================
const TYPE_CONFIG: Record<
  AdminSearchResult["type"],
  {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
  }
> = {
  order: { label: "سفارش", icon: ShoppingBag, color: "text-blue-500" },
  user: { label: "کاربر", icon: Users, color: "text-green-500" },
  product: { label: "محصول", icon: Package, color: "text-purple-500" },
  coupon: { label: "کد تخفیف", icon: Ticket, color: "text-orange-500" },
  material: { label: "متریال", icon: Layers, color: "text-teal-500" },
  project: { label: "پروژه", icon: FolderKanban, color: "text-pink-500" },
};

type AdminSearchResultsProps = {
  results: AdminSearchResult[];
  groupedResults: Record<AdminSearchResult["type"], AdminSearchResult[]>;
  types: AdminSearchResult["type"][];
  isLoading: boolean;
  query: string;
  selectedIndex: number;
  resultsRef: RefObject<HTMLDivElement | null>;
  onItemClick: () => void;
};

function AdminSearchResults({
  results,
  groupedResults,
  types,
  isLoading,
  query,
  selectedIndex,
  resultsRef,
  onItemClick,
}: AdminSearchResultsProps) {
  if (isLoading) {
    return (
      <div className="text-muted-foreground flex items-center justify-center gap-2 px-4 py-7 text-sm">
        <Loader2 className="text-primary size-4 animate-spin" />
        <span>در حال جستجو...</span>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-muted-foreground px-4 py-7 text-center text-sm">
        <Search className="mx-auto mb-2 size-5 opacity-50" />
        <p>
          نتیجه‌ای برای «<span className="font-medium">{query}</span>» پیدا نشد.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* ناحیه اسکرول‌شونده نتایج */}
      <div
        ref={resultsRef}
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-2"
      >
        {types.map((type) => {
          const config = TYPE_CONFIG[type];
          const items = groupedResults[type];
          const Icon = config.icon;

          return (
            <div key={type} className="mb-2 last:mb-0">
              {/* عنوان گروه */}
              <div className="flex items-center gap-2 px-3 py-1.5">
                <Icon className={cn("size-3.5", config.color)} />
                <span className="text-muted-foreground text-xs font-medium">
                  {config.label}
                </span>
                <span className="text-muted-foreground bg-muted dark:bg-muted/50 rounded-full px-1.5 py-0.5 text-[10px]">
                  {items.length}
                </span>
              </div>

              {/* آیتم‌های گروه */}
              <div className="space-y-0.5">
                {items.map((result) => {
                  const index = results.indexOf(result);
                  const isSelected = index === selectedIndex;

                  return (
                    <Link
                      key={`${result.type}-${result.id}`}
                      href={result.href}
                      data-search-item
                      onClick={onItemClick}
                      className={cn(
                        "group flex items-center gap-3 rounded-lg px-3 py-2.5",
                        "text-right transition-colors outline-none",
                        isSelected
                          ? "bg-accent text-accent-foreground"
                          : "hover:bg-muted/60 dark:hover:bg-muted/40",
                      )}
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">
                          {result.title}
                        </p>
                        {result.description ? (
                          <p className="text-muted-foreground mt-0.5 truncate text-xs">
                            {result.description}
                          </p>
                        ) : null}
                      </div>
                      <ArrowLeft
                        aria-hidden="true"
                        className="text-muted-foreground group-hover:text-foreground size-4 shrink-0 transition-transform group-hover:-translate-x-0.5"
                      />
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* فوتر ثابت — هرگز روی نتایج نمی‌افتد */}
      <div className="bg-muted/60 dark:bg-muted/30 border-border/60 dark:border-border/40 shrink-0 border-t px-3 py-2">
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
    </>
  );
}

export default AdminSearchResults;
