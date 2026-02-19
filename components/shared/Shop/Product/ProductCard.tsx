"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ProductWithRelations } from "@/types";

type ProductCardProps = {
  // 1. نام پراپ برای خوانایی بهتر به product تغییر کرد
  product: ProductWithRelations;
  href: string;
};

function ProductCard({ product, href }: ProductCardProps) {
  // 2. دسترسی به اولین واریانت برای نمایش در کارت
  // یک کارت محصول معمولاً اطلاعات واریانت پیش‌فرض (اولین واریانت) را نشان می‌دهد
  const firstVariant = product.variants?.[0];

  // اگر محصولی به هر دلیلی واریانت نداشت، کارت را رندر نمی‌کنیم تا خطا ندهد
  if (!firstVariant) {
    return null;
  }

  // این منطق تخفیف که سمت کلاینت است، دست‌نخورده باقی می‌ماند
  const [discountPercent] = useState(15);

  const discountedPrice = Math.round(
    firstVariant.price * (1 - discountPercent / 100),
  );

  return (
    <Card className="group flex h-full flex-col overflow-hidden transition-shadow hover:shadow-xl">
      {/* Image */}
      <CardHeader className="relative p-0">
        <Link
          href={href}
          className="bg-muted relative block aspect-4/3 w-full overflow-hidden"
        >
          <Image
            fill
            unoptimized
            // 3. استفاده از تصویر اولین واریانت و ارائه یک تصویر جایگزین در صورت نبودن عکس
            src={firstVariant.images?.[0] ?? "/images/placeholder.svg"}
            // 4. استفاده از عنوان واریانت برای alt تصویر
            alt={firstVariant.title}
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-center transition-transform duration-300 group-hover:scale-105"
          />

          {/* 5. استفاده از نام دسته‌بندی و بررسی وجود آن با ?. */}
          {product.category?.name && (
            <Badge
              variant="secondary"
              className="absolute top-3 right-3 rounded-full px-2 py-1 text-xs"
            >
              {product.category.name}
            </Badge>
          )}

          {/* Discount badge */}
          {discountPercent > 0 && (
            <Badge className="bg-destructive absolute top-3 left-3 rounded-full px-2 py-1 text-white">
              {discountPercent}٪ تخفیف
            </Badge>
          )}
        </Link>
      </CardHeader>

      {/* Content */}
      <CardContent className="flex flex-1 flex-col gap-2 p-4">
        {/* 6. استفاده از عنوان اصلی محصول */}
        <CardTitle className="line-clamp-2 text-sm leading-6 font-semibold">
          <Link href={href}>{product.title}</Link>
        </CardTitle>

        {/* 7. استفاده از ریتینگ محصول اصلی */}
        <div className="text-muted-foreground text-sm">
          ⭐ {product.rating} ({product.numReviews})
        </div>

        {/* 8. نمایش عنوان واریانت به عنوان توضیحات */}
        <CardDescription className="line-clamp-2 text-sm">
          {firstVariant.title}
        </CardDescription>

        {/* Price */}
        <div className="mt-auto flex items-end justify-between pt-4">
          <div className="flex flex-col">
            {/* 9. استفاده از قیمت واریانت */}
            <span className="text-muted-foreground text-sm line-through">
              {firstVariant.price.toLocaleString("fa-IR")} تومان
            </span>

            {discountPercent > 0 && (
              <span className="text-destructive text-base font-bold">
                {discountedPrice.toLocaleString("fa-IR")} تومان
              </span>
            )}
          </div>

          <Button
            size="icon"
            variant="default"
            // 10. بررسی موجودی واریانت
            disabled={firstVariant.stock === 0}
            className="cursor-pointer rounded-full"
            aria-label="افزودن به سبد خرید"
          >
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
      {/* Footer CTA */}
      <CardFooter className="p-3 pt-0">
        <Button
          variant="default"
          className="w-full rounded-full text-sm"
          asChild
        >
          <Link href={href}>جزئیات محصول</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default ProductCard;
