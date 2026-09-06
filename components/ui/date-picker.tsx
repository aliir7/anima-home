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
  compact?: boolean;
}

export function DatePicker({
  value,
  onChange,
  disabled = false,
  placeholder = "تاریخ را انتخاب کنید",
  className,
  compact = false,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

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
            "w-full justify-between rounded-md font-normal",
            "hover:bg-background",
            !value && "text-muted-foreground",
            compact ? "h-9 px-2.5 text-xs" : "h-10 px-3 text-sm",
            className,
          )}
        >
          <span dir="rtl" className="flex-1 text-right font-medium">
            {displayValue || placeholder}
          </span>
          <CalendarDays
            className={cn(
              "shrink-0 opacity-60",
              compact ? "size-3.5" : "size-4",
            )}
          />
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-auto p-0" dir="rtl">
        <div className={cn(compact ? "p-2" : "p-3")}>
          <Calendar
            mode="single"
            selected={value ?? undefined}
            onSelect={handleSelect}
            defaultMonth={value ?? undefined}
            showOutsideDays={false} // ✅ روزهای خارج از ماه نمایش داده نمی‌شوند
            className={cn(
              "rounded-lg border",
              compact && "[--cell-size:--spacing(7)]",
            )}
          />

          {value && (
            <div
              className={cn("border-t", compact ? "mt-1.5 pt-2" : "mt-2 pt-3")}
            >
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
