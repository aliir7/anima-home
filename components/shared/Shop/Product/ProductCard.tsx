"use client";

import { useState } from "react";
import Image from "next/image";
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
import { Cart, CartItem, ShopItem } from "@/types";
import Link from "next/link";

type ProductCardProps = {
  data: ShopItem;
  href: string;
  cart?: Cart;
  CartItem: CartItem;
};

function ProductCard({ data, href }: ProductCardProps) {
  const { product, variant, category } = data;

  // ✅ UI-driven discount (no backend dependency)
  const [discountPercent] = useState(15); // فقط برای تست UI

  const discountedPrice = Math.round(
    variant.price * (1 - discountPercent / 100),
  );

  return (
    <Card className="group flex h-full flex-col overflow-hidden transition-shadow hover:shadow-xl">
      {/* Image */}
      <CardHeader className="relative p-0">
        <div className="bg-muted relative aspect-4/3 w-full overflow-hidden">
          <Image
            fill
            unoptimized
            src={variant.images[0]}
            alt={variant.title}
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {/* Category badge */}
          <Badge
            variant="secondary"
            className="absolute top-3 right-3 rounded-full px-2 py-1 text-xs"
          >
            {category.title}
          </Badge>

          {/* ✅ Discount badge */}
          {discountPercent > 0 && (
            <Badge className="bg-destructive absolute top-3 left-3 rounded-full px-2 py-1 text-white">
              {discountPercent}٪ تخفیف
            </Badge>
          )}
        </div>
      </CardHeader>

      {/* Content */}
      <CardContent className="flex flex-1 flex-col gap-2 p-4">
        <CardTitle className="line-clamp-2 text-sm leading-6 font-semibold">
          {product.title}
        </CardTitle>

        <div className="text-muted-foreground text-sm">
          ⭐ {product.rating} ({product.numReviews})
        </div>

        <CardDescription className="text-muted-foreground line-clamp-2 text-sm">
          {variant.title}
        </CardDescription>

        {/* Price */}
        <div className="mt-auto flex items-end justify-between pt-4">
          <div className="flex flex-col">
            {/* Original price */}
            <span className="text-muted-foreground text-sm line-through">
              {variant.price.toLocaleString("fa-IR")} تومان
            </span>

            {/* Discounted price */}
            <span className="text-destructive text-base font-bold">
              {discountedPrice.toLocaleString("fa-IR")} تومان
            </span>
          </div>

          <Button
            size="icon"
            variant="default"
            disabled={variant.stock === 0}
            className="cursor-pointer rounded-full"
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
