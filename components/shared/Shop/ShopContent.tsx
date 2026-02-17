"use client";

import { useMemo, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { ShopItem } from "@/types";
import ProductCard from "./Product/ProductCard";

type Props = {
  items: ShopItem[];
};

const SORTS = ["جدیدترین", "قدیمی‌ترین", "ارزان‌ترین", "گران‌ترین"] as const;

export default function ShopContent({ items }: Props) {
  const [sort, setSort] = useState<(typeof SORTS)[number]>("جدیدترین");
  const [categoryId, setCategoryId] = useState<string | "all">("all");

  const categories = useMemo(() => {
    return Array.from(
      new Map(items.map((i) => [i.category.id, i.category])).values(),
    );
  }, [items]);

  const filteredItems = useMemo(() => {
    let data = [...items];

    if (categoryId !== "all") {
      data = data.filter((i) => i.category.id === categoryId);
    }

    switch (sort) {
      case "جدیدترین":
        return data.sort(
          (a, b) =>
            new Date(b.product.createdAt).getTime() -
            new Date(a.product.createdAt).getTime(),
        );

      case "قدیمی‌ترین":
        return data.sort(
          (a, b) =>
            new Date(a.product.createdAt).getTime() -
            new Date(b.product.createdAt).getTime(),
        );

      case "ارزان‌ترین":
        return data.sort((a, b) => a.variant.price - b.variant.price);

      case "گران‌ترین":
        return data.sort((a, b) => b.variant.price - a.variant.price);

      default:
        return data;
    }
  }, [items, sort, categoryId]);

  return (
    <div className="c mx-auto space-y-8 px-4 py-12">
      {/* Toolbar */}
      <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="flex gap-3">
          {/* Sort */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2 rounded-full">
                {sort}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {SORTS.map((s) => (
                <DropdownMenuItem key={s} onClick={() => setSort(s)}>
                  {s}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Category */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2 rounded-full">
                {categoryId === "all"
                  ? "همه دسته‌ها"
                  : categories.find((c) => c.id === categoryId)?.title}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => setCategoryId("all")}>
                همه دسته‌ها
              </DropdownMenuItem>
              {categories.map((cat) => (
                <DropdownMenuItem
                  key={cat.id}
                  onClick={() => setCategoryId(cat.id)}
                >
                  {cat.title}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Count */}
        <p className="text-muted-foreground text-sm">
          نمایش{" "}
          <span className="text-foreground font-medium">
            {filteredItems.length}
          </span>{" "}
          محصول
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {filteredItems.map((item) => (
          <ProductCard
            key={item.variant.id}
            data={item}
            href={`/shop/products/${item.product.id}`}
          />
        ))}
      </div>
    </div>
  );
}
