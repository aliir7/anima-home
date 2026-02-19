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

  const [discountPercent] = useState(15);

  const discountedPrice = Math.round(
    firstVariant.price * (1 - discountPercent / 100),
  );

  return (
    <div className="container mx-auto px-4 py-8">
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
          <div className="space-y-2">
            <h1 className="text-xl leading-8 font-bold">{product.title}</h1>

            {/* ✅ Meta bar */}
            <div className="text-muted-foreground flex flex-wrap items-center gap-3 text-sm">
              {product.category?.name && <span>{product.category.name}</span>}

              <span className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                {product.rating} ({product.numReviews})
              </span>
            </div>
          </div>

          <Separator />

          {/* Variant desc */}
          <p className="text-muted-foreground text-sm leading-7">
            {firstVariant.title}
          </p>
          {/* ✅ SPECS */}
          {firstVariant.specs && Object.keys(firstVariant.specs).length > 0 && (
            <>
              <Separator />
              <ProductSpecs specs={firstVariant.specs} />
            </>
          )}
          {product.description && (
            <>
              <Separator />
              <div>
                <p className="mb-2 font-medium">توضیحات</p>
                <p className="text-muted-foreground text-sm leading-7">
                  {product.description}
                </p>
              </div>
            </>
          )}
        </div>

        {/* BUY BOX */}
        <div className="lg:col-span-3">
          <Card className="sticky top-24">
            <CardContent className="space-y-4 p-6">
              {discountPercent > 0 && (
                <Badge variant="destructive" className="w-fit">
                  {discountPercent}٪ تخفیف
                </Badge>
              )}

              <div className="flex flex-col">
                <span className="text-muted-foreground text-sm line-through">
                  {firstVariant.price.toLocaleString("fa-IR")} تومان
                </span>

                <span className="text-primary text-2xl font-bold">
                  {discountedPrice.toLocaleString("fa-IR")} تومان
                </span>
              </div>

              <Badge
                variant={firstVariant.stock > 0 ? "secondary" : "destructive"}
                className="w-fit"
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
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ✅ REVIEWS */}
      <ProductReviewsSection product={product} />
    </div>
  );
}
