"use client";

import { useState } from "react";
import Image from "next/image";
import { ShoppingCart, Star } from "lucide-react";

import { Cart, ProductWithRelations } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { ProductReviewsSection } from "./ProductReviewsSection";
import { ProductSpecs } from "./ProductSpecs";
import CartActionsHandler from "../CartActionsHandler";
import Link from "next/link";
import Rating from "@/components/ui/Rating";

type ProductDetailsProps = {
  product: ProductWithRelations;
  userId?: string | null;
  cart?: Cart | undefined;
};

export default function ProductDetailsClient({
  product,
  userId,
  cart,
}: ProductDetailsProps) {
  const firstVariant = product.variants?.[0];
  if (!firstVariant) return null;

  const [discountPercent] = useState(0);

  const discountedPrice = Math.round(
    firstVariant.price * (1 - discountPercent / 100),
  );

  return (
    <div className="wrapper px-4 py-8">
      {/* ✅ TOP */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* IMAGE */}
        <div className="lg:col-span-5">
          <Card className="sticky top-24">
            <CardContent className="p-6">
              <div className="relative aspect-square">
                <Image
                  fill
                  unoptimized
                  src={firstVariant.images?.[0] ?? "/images/placeholder.svg"}
                  alt={firstVariant.title}
                  className="object-contain"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* INFO */}
        <div className="space-y-6 text-right lg:col-span-4">
          <div className="space-y-1">
            <h3 className="text-xl leading-8 font-bold">{product.title}</h3>

            {/* ✅ Meta bar */}
            <div className="text-muted-foreground flex flex-wrap items-center gap-3 text-sm dark:text-neutral-600">
              {product.category?.name && <span>{product.category.name}</span>}

              <span className="flex items-center gap-1">
                <Rating rate={4} size={14} />
              </span>
            </div>
          </div>

          {/* Variant desc */}

          {/* ✅ SPECS */}
          {firstVariant.specs && Object.keys(firstVariant.specs).length > 0 && (
            <>
              <ProductSpecs specs={firstVariant.specs} />
            </>
          )}
          {product.description && (
            <>
              <Separator />
              <div>
                <p className="text-primary mb-2 font-semibold dark:text-neutral-800">
                  توضیحات
                </p>
                <p className="text-muted-foreground text-sm leading-7 font-medium dark:text-neutral-700">
                  {product.description}
                </p>
              </div>
            </>
          )}
        </div>

        {/* BUY BOX */}
        <div className="lg:col-span-3">
          <Card className="sticky top-24">
            <CardContent className="space-y-5 p-6">
              {discountPercent > 0 && (
                <Badge variant="destructive" className="w-fit">
                  {discountPercent}٪ تخفیف
                </Badge>
              )}

              <div className="flex flex-col">
                {discountPercent > 0 && (
                  <span className="text-muted-foreground text-sm line-through">
                    {firstVariant.price.toLocaleString("fa-IR")} تومان
                  </span>
                )}
                <span className="text-primary text-2xl font-bold">
                  {discountedPrice.toLocaleString("fa-IR")} تومان
                </span>
              </div>

              <Badge
                variant={firstVariant.stock > 0 ? "secondary" : "destructive"}
                className="w-fit rounded-full px-2 py-1 dark:bg-green-300 dark:text-neutral-800"
              >
                {firstVariant.stock > 0 ? `موجود` : "ناموجود"}
              </Badge>

              <CartActionsHandler
                item={{
                  productId: product.id,
                  name: product.title,
                  price:
                    discountedPrice > 0 ? discountedPrice : firstVariant.price,
                  slug: product.slug,
                  qty: 1,
                  image: firstVariant.images?.[0],
                }}
                cart={cart}
              />
              {cart?.items.length! > 0 && (
                <Button
                  className="w-full gap-2 rounded-full"
                  size="lg"
                  type="button"
                  variant="outline"
                  asChild
                >
                  <Link href="/shop/cart">رفتن به سبد خرید</Link>
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ✅ REVIEWS */}
      <ProductReviewsSection product={product} />
    </div>
  );
}
