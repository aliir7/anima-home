"use client";

import Link from "next/link";

import { ArrowLeft, Phone, ShoppingCart } from "lucide-react";

import { Cart, ProductWithRelations, ReviewWithUser } from "@/types";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { ProductReviewsSection } from "./ProductReviewsSection";
import { ProductSpecs } from "./ProductSpecs";
import ProductImages from "./ProductImages";
import CartActionsHandler from "../CartActionsHandler";
import ProductDescription from "./ProductDescription";

import Rating from "@/components/ui/Rating";
import { getStorageUrl } from "@/lib/utils/urlUtils";

type ProductDetailsContentProps = {
  product: ProductWithRelations;
  userId?: string | null;
  cart?: Cart;
  initialReviews: ReviewWithUser[];
  initialHasMore: boolean;
  eligibility: {
    canReview: boolean;
    reason?: "NOT_LOGGED_IN" | "NOT_PURCHASED" | "ALREADY_REVIEWED";
  };
};

function ProductDetailsContent({
  product,
  cart,
  initialReviews,
  initialHasMore,
  eligibility,
}: ProductDetailsContentProps) {
  const firstVariant = product.variants?.[0];

  if (!firstVariant) return null;

  const discountPercent = firstVariant.discountPercent ?? 0;
  const isInStock = firstVariant.stock > 0;

  const discountedPrice =
    discountPercent > 0
      ? Math.round(firstVariant.price * (1 - discountPercent / 100))
      : firstVariant.price;

  const rating = Number(product.rating) || 0;

  const images =
    firstVariant.images
      ?.map((image) => getStorageUrl(image))
      .filter((image): image is string => Boolean(image)) ?? [];

  return (
    <section className="wrapper px-4 py-8">
      {/* Product Main Content */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-5">
        {/* Images */}
        <div className="md:col-span-2">
          <ProductImages images={images} productTitle={product.title} />
        </div>

        {/* Details */}
        <div className="p-5 md:col-span-2">
          <div className="flex flex-col gap-6">
            {/* Brand / Category / SKU */}
            <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-sm dark:text-neutral-600">
              {product.brand && <span>{product.brand}</span>}

              {product.brand && product.category?.name && <span>•</span>}

              {product.category?.name && <span>{product.category.name}</span>}

              {(product.brand || product.category?.name) && <span>•</span>}

              <span>
                کد محصول:{" "}
                <span className="text-foreground font-medium dark:text-neutral-500">
                  {firstVariant.sku}
                </span>
              </span>
            </div>

            {/* Title */}
            <h1 className="h3-bold">{product.title}</h1>

            {/* Rating */}
            <div className="flex items-center">
              <Rating rate={5} size={18} />
            </div>

            <Separator />

            {/* Specs */}
            {firstVariant.specs &&
              Object.keys(firstVariant.specs).length > 0 && (
                <ProductSpecs specs={firstVariant.specs} />
              )}
          </div>
        </div>

        {/* Buy Box */}
        <div className="md:col-span-1">
          <Card className="sticky top-24">
            <CardContent className="space-y-5 p-5">
              {/* Discount */}
              {discountPercent > 0 && isInStock && (
                <Badge variant="destructive" className="w-fit rounded-full">
                  {discountPercent}٪ تخفیف
                </Badge>
              )}

              {/* Price */}
              <div className="flex flex-col gap-1">
                {discountPercent > 0 && isInStock && (
                  <span className="text-muted-foreground text-sm line-through">
                    {firstVariant.price.toLocaleString("fa-IR")} تومان
                  </span>
                )}

                {isInStock ? (
                  <span className="text-primary text-xl font-bold">
                    {discountedPrice.toLocaleString("fa-IR")} تومان
                  </span>
                ) : (
                  <span className="text-primary text-xl font-bold">
                    تماس بگیرید
                  </span>
                )}
              </div>

              {/* Stock / Contact */}
              {isInStock ? (
                <Badge
                  variant="secondary"
                  className="w-fit rounded-full px-3 py-1"
                >
                  موجودی: {firstVariant.stock}
                </Badge>
              ) : (
                <Button
                  asChild
                  variant="outline"
                  className="w-full justify-between rounded-full"
                >
                  <Link href="/contact">
                    <span className="flex items-center gap-2">
                      <Phone className="size-4" />
                      تماس با ما
                    </span>

                    <ArrowLeft className="size-4" />
                  </Link>
                </Button>
              )}

              {/* Cart */}
              {isInStock && (
                <CartActionsHandler
                  item={{
                    productId: product.id,
                    name: product.title,
                    price: discountedPrice,
                    slug: product.slug,
                    qty: 1,
                    image: firstVariant.images?.[0],
                    variantId: firstVariant.id,
                  }}
                  cart={cart}
                />
              )}

              {/* Go To Cart */}
              {cart?.items?.length! > 0 && (
                <Button
                  className="w-full gap-2 rounded-full"
                  size="lg"
                  type="button"
                  variant="outline"
                  asChild
                >
                  <Link href="/shop/cart">
                    <ShoppingCart className="size-4" />
                    رفتن به سبد خرید
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Long Description */}
      {product.description && (
        <ProductDescription content={product.description} />
      )}

      {/* Reviews */}
      <div className="mt-12">
        <ProductReviewsSection
          product={product}
          initialReviews={initialReviews}
          initialHasMore={initialHasMore}
          eligibility={eligibility}
        />
      </div>
    </section>
  );
}

export default ProductDetailsContent;
