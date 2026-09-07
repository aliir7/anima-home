"use client";

import { Loader2, Search, X } from "lucide-react";
import type { KeyboardEvent, RefObject } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils/utils";

type AdminSearchTriggerProps = {
  isExpanded: boolean;
  query: string;
  isLoading: boolean;
  isOpen: boolean;
  pathname: string;
  inputRef: RefObject<HTMLInputElement | null>;
  onExpand: () => void;
  onCollapse: () => void;
  onQueryChange: (value: string) => void;
  onFocus: () => void;
  onBlur: () => void;
  onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
};

function AdminSearchTrigger({
  isExpanded,
  query,
  isLoading,
  isOpen,
  pathname,
  inputRef,
  onExpand,
  onCollapse,
  onQueryChange,
  onFocus,
  onBlur,
  onKeyDown,
  onSubmit,
}: AdminSearchTriggerProps) {
  /*
    حالت جمع: فقط آیکون جستجو
  */
  if (!isExpanded) {
    return (
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onExpand}
        aria-label="باز کردن جستجو"
        className={cn(
          "size-9 rounded-full",
          "text-muted-foreground hover:text-foreground",
          "hover:bg-muted dark:hover:bg-muted/50",
          "focus-visible:ring-primary/40 focus-visible:ring-2",
        )}
      >
        <Search className="size-4.5" />
      </Button>
    );
  }

  /*
    حالت باز: اینپوت جستجو
    ✅ ring با رنگ primary در هر دو تم (توکن primary خودشان با تم هماهنگ می‌شوند)
  */
  return (
    <form
      id="admin-search-form"
      action={pathname}
      method="GET"
      onSubmit={onSubmit}
      dir="rtl"
      className="animate-in fade-in-0 zoom-in-95 duration-150"
    >
      <div className="relative flex w-56 items-center md:w-64 lg:w-72">
        <Search
          aria-hidden="true"
          className="text-muted-foreground pointer-events-none absolute top-1/2 right-3 z-10 size-4 -translate-y-1/2"
        />

        <Input
          ref={inputRef}
          type="search"
          name="query"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          onFocus={onFocus}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
          placeholder="جستجو..."
          dir="rtl"
          autoComplete="off"
          aria-label="جستجو در پنل مدیریت"
          aria-expanded={isOpen}
          className={cn(
            "h-9 w-full rounded-full",
            "bg-background/80 backdrop-blur-sm",
            "dark:bg-background/60",
            "pr-9 pl-10",
            "text-right text-sm",
            "border-border/60 dark:border-border/40",
            "placeholder:text-muted-foreground placeholder:text-xs",
            "shadow-sm",
            // ✅ ring با رنگ primary
            "focus-visible:ring-primary/40 focus-visible:ring-2 focus-visible:ring-offset-0",
            "dark:focus-visible:ring-primary/50",
          )}
        />

        {isLoading ? (
          <Loader2
            aria-hidden="true"
            className="text-primary pointer-events-none absolute top-1/2 left-8 z-10 size-4 -translate-y-1/2 animate-spin"
          />
        ) : null}

        <button
          type="button"
          onClick={onCollapse}
          aria-label="بستن جستجو"
          className={cn(
            "absolute top-1/2 left-2.5 z-10 -translate-y-1/2",
            "text-muted-foreground hover:text-foreground",
            "flex size-5 items-center justify-center rounded-full",
            "hover:bg-muted dark:hover:bg-muted/50",
            "transition-colors",
          )}
        >
          <X className="size-3.5" />
        </button>

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
  );
}

export default AdminSearchTrigger;
