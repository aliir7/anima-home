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

  const normalizedCategories = categories.map(
    (cat) => cat.parentName ?? cat.name.toLowerCase(),
  );
  const isNewValue =
    inputValue && !normalizedCategories.includes(inputValue.toLowerCase());

  // اگر هیچ دسته‌ای نداریم، فقط input ساده نشون بده
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
          className="w-full cursor-pointer justify-between rounded-full"
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
            {categories.map((cat) => (
              <CommandItem
                key={cat.id}
                value={cat.parentName ?? cat.name}
                onSelect={(currentValue) => {
                  onChange(currentValue);
                  setInputValue(currentValue);
                  setOpen(false);
                }}
                asChild
              >
                <Button
                  type="button"
                  className="flex w-full items-center justify-between text-right"
                >
                  <Check
                    className={cn(
                      "ml-2 h-4 w-4",
                      value === cat.name || cat.parentName
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                  {cat.parentName ?? cat.name}
                </Button>
              </CommandItem>
            ))}

            {isNewValue && (
              <CommandItem
                value={inputValue}
                onSelect={() => {
                  onChange(inputValue);
                  setOpen(false);
                }}
                className="text-primary cursor-pointer"
                asChild
              >
                <Button className="w-full text-right" type="button">
                  <strong className="mx-1">{inputValue}</strong>
                  ساخت دسته جدید با عنوان:
                </Button>
              </CommandItem>
            )}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
