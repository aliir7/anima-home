"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils/utils"; // فرض بر وجود utils است

type Option = {
  label: string;
  value: string;
};

type FilterDropdownProps = {
  title: string;
  options: Option[];
  currentValue: string | null | undefined;
  onChange: (value: string | null) => void;
  placeholder?: string;
  className?: string;
};

export default function FilterDropdown({
  title,
  options,
  currentValue,
  onChange,
  placeholder = "همه موارد",
  className,
}: FilterDropdownProps) {
  // پیدا کردن لیبل آیتم انتخاب شده
  const selectedLabel = options.find(
    (opt) => opt.value === currentValue,
  )?.label;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "justify-between gap-2 rounded-full font-normal dark:text-neutral-50",
            className,
          )}
        >
          {selectedLabel ?? placeholder}
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        {/* گزینه برای پاک کردن فیلتر */}
        <DropdownMenuItem
          onClick={() => onChange(null)}
          className="text-muted-foreground cursor-pointer font-medium"
        >
          {placeholder}
        </DropdownMenuItem>

        {options.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => onChange(option.value)}
            className={cn(
              "cursor-pointer",
              currentValue === option.value &&
                "bg-accent text-accent-foreground font-medium",
            )}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
