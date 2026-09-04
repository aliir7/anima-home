"use client";

import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";

type SearchInputProps = {
  initialValue: string | null;
  onSearch: (value: string | null) => void;
  placeholder?: string;
};

export default function SearchInput({
  initialValue,
  onSearch,
  placeholder = "جستجوی محصول...",
}: SearchInputProps) {
  const [value, setValue] = useState(initialValue ?? "");
  const debouncedValue = useDebounce(value, 400);

  // فقط وقتی مقدار debounce-شده تغییر کرد navigation انجام بده
  useEffect(() => {
    const trimmed = debouncedValue.trim();
    onSearch(trimmed.length > 0 ? trimmed : null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue]);

  // اگر مقدار اولیه از URL (مثلاً بعد از رفرش) تغییر کرد، input را هم‌سو کن
  useEffect(() => {
    setValue(initialValue ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValue]);

  return (
    <div className="relative w-full md:max-w-xs">
      <Search className="text-muted-foreground pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2" />
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="rounded-full pr-9 pl-9"
      />
      {value && (
        <button
          type="button"
          onClick={() => setValue("")}
          className="text-muted-foreground hover:text-foreground absolute top-1/2 left-3 -translate-y-1/2"
          aria-label="پاک کردن جستجو"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
