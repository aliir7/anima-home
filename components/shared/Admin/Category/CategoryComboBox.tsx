"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils/utils";
import { useState } from "react";

type CategoryComboboxProps = {
  categories: { id: string; name: string }[];
  value: string;
  onChange: (value: string) => void;
};

function CategoryCombobox({
  value,
  onChange,
  categories,
}: CategoryComboboxProps) {
  const [open, setOpen] = useState(false);

  const selectedCategory = categories.find(
    (c) => c.id === value || c.name === value,
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedCategory
            ? selectedCategory.name
            : value || "انتخاب یا نوشتن والد"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="جستجوی والد..." />
          <CommandList>
            {categories.map((category) => (
              <CommandItem
                key={category.id}
                value={category.name}
                onSelect={() => {
                  onChange(category.id);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "ml-2 h-4 w-4",
                    value === category.id ? "opacity-100" : "opacity-0",
                  )}
                />
                {category.name}
              </CommandItem>
            ))}
            <CommandItem
              value={value}
              onSelect={(val) => {
                onChange(val);
                setOpen(false);
              }}
            >
              + ایجاد: {value}
            </CommandItem>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default CategoryCombobox;
