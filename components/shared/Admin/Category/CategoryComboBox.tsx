"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { cn } from "@/lib/utils/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CategoryWithParent } from "@/types";

type CategoryComboboxProps = {
  categories: CategoryWithParent[];
  value: string;
  onChange: (value: string) => void;
};

export default function CategoryCombobox({
  categories,
  value,
  onChange,
}: CategoryComboboxProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const normalizedCategories = categories.map((cat) =>
    (cat.parentName ?? cat.name).toLowerCase(),
  );
  const isNewValue =
    inputValue && !normalizedCategories.includes(inputValue.toLowerCase());

  // اگر هیچ دسته‌بندی‌ای وجود ندارد، فقط input نمایش بده
  if (categories.length === 0) {
    return (
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="نام والد را وارد کنید"
        className="rounded-full"
      />
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between rounded-full"
        >
          {value || "انتخاب یا وارد کردن نام والد"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput
            placeholder="جستجوی والد یا ایجاد جدید..."
            value={inputValue}
            onValueChange={setInputValue}
          />
          <CommandEmpty>هیچ موردی یافت نشد.</CommandEmpty>
          <CommandGroup>
            {categories.map((cat) => {
              const catName = cat.parentName ?? cat.name;
              return (
                <CommandItem
                  key={cat.id}
                  value={catName}
                  onSelect={() => {
                    onChange(catName);
                    setInputValue(catName);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "ml-2 h-4 w-4",
                      value === catName ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {catName}
                </CommandItem>
              );
            })}

            {isNewValue && (
              <CommandItem
                value={inputValue}
                onSelect={() => {
                  onChange(inputValue);
                  setOpen(false);
                }}
                className="text-primary"
              >
                ساخت دسته جدید با عنوان:{" "}
                <strong className="mx-1">{inputValue}</strong>
              </CommandItem>
            )}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
