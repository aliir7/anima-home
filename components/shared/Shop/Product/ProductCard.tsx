"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ProductWithRelations } from "@/types";
import Rating from "@/components/ui/Rating";

type ProductCardProps = {
  product: ProductWithRelations;
  href: string;
};

function ProductCard({ product, href }: ProductCardProps) {
  const firstVariant = product.variants?.[0];
  if (!firstVariant) return null;

  const [discountPercent] = useState(0);

  const discountedPrice = Math.round(
    firstVariant.price * (1 - discountPercent / 100),
  );

  return (
    <Card className="group flex h-full flex-col overflow-hidden transition-shadow hover:shadow-xl">
      {/* 
        استفاده از aspect-[4/3] به جای h-44 باعث میشود عکس متناسب با عرض کارت، ارتفاع بگیرد
        و از حالت کشیدگی در بیاید
      */}
      <Link
        href={href}
        className="relative block aspect-4/3 w-full shrink-0 overflow-hidden bg-gray-50/50"
      >
        <Image
          fill
          unoptimized
          src={firstVariant.images?.[0] ?? "/images/placeholder.svg"}
          alt={firstVariant.title}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          // اضافه شدن object-cover الزامی است
          className="object-center transition-transform duration-300 group-hover:scale-105"
        />

        {product.category?.name && (
          <Badge
            variant="secondary"
            className="absolute top-3 right-3 rounded-full px-2 py-1 text-xs shadow-sm"
          >
            {product.category.name}
          </Badge>
        )}

        {discountPercent > 0 && (
          <Badge className="bg-destructive absolute top-3 left-3 rounded-full px-2 py-1 text-xs text-white shadow-sm">
            {discountPercent}٪ تخفیف
          </Badge>
        )}
      </Link>

      {/* Content - فاصله gap-2 به gap-1.5 کاهش یافت تا کمی فشرده تر شود */}
      <CardContent className="flex flex-1 flex-col gap-1.5 p-4">
        {/* Title */}
        <CardTitle className="line-clamp-2 h-11 text-sm leading-5 font-semibold">
          <Link href={href} className="hover:text-primary transition-colors">
            {product.title}
          </Link>
        </CardTitle>

        <Rating rate={4} size={14} />

        {/* Variant */}
        <CardDescription className="text-muted-foreground line-clamp-1 h-5 text-xs">
          {firstVariant.title}
        </CardDescription>

        {/* Description */}
        <div className="h-10">
          {product.description && (
            <p className="text-muted-foreground line-clamp-2 text-xs leading-5">
              {product.description}
            </p>
          )}
        </div>

        {/* Price */}
        <div className="mt-auto pt-3">
          <div className="flex flex-col">
            <span
              className={`text-muted-foreground text-base ${
                discountPercent > 0 ? "text-xs line-through" : "font-semibold"
              }`}
            >
              {firstVariant.price.toLocaleString("fa-IR")} تومان
            </span>

            {discountPercent > 0 && (
              <span className="text-destructive text-base font-bold">
                {discountedPrice.toLocaleString("fa-IR")} تومان
              </span>
            )}
          </div>
        </div>
      </CardContent>

      {/* Footer */}
      <CardFooter className="p-4 pt-0">
        <Button className="w-full rounded-full text-sm font-medium" asChild>
          <Link href={href}>جزئیات محصول</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default ProductCard;
