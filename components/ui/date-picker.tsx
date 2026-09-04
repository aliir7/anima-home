"use client";

import * as React from "react";
import { format as formatJalali } from "date-fns-jalali";
import { CalendarDays, X } from "lucide-react";

import { cn } from "@/lib/utils/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calender";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export interface DatePickerProps {
  value?: Date | null;
  onChange?: (date: Date | null) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export function DatePicker({
  value,
  onChange,
  disabled = false,
  placeholder = "تاریخ را انتخاب کنید",
  className,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  // فرمت نمایش تاریخ به شمسی: ۱۴۰۵/۰۶/۲۰
  const displayValue = value ? formatJalali(value, "yyyy/MM/dd") : "";

  const handleSelect = (date: Date | undefined) => {
    onChange?.(date ?? null);
    setOpen(false);
  };

  const handleClear = () => {
    onChange?.(null);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          className={cn(
            "h-10 w-full justify-between rounded-md px-3 font-normal",
            "hover:bg-background",
            !value && "text-muted-foreground",
            className,
          )}
        >
          <span dir="rtl" className="flex-1 text-right text-sm font-medium">
            {displayValue || placeholder}
          </span>
          <CalendarDays className="size-4 shrink-0 opacity-60" />
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-auto p-0" dir="rtl">
        <div className="p-3">
          <Calendar
            mode="single"
            selected={value ?? undefined}
            onSelect={handleSelect}
            defaultMonth={value ?? undefined}
            className="rounded-lg border"
          />

          {value && (
            <div className="mt-2 border-t pt-3">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive hover:bg-destructive/10 w-full"
                onClick={handleClear}
              >
                <X className="ml-2 size-4" />
                حذف تاریخ
              </Button>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
