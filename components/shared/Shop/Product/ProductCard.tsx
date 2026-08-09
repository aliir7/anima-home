"use client";

import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import Rating from "@/components/ui/Rating";
import type { ProductWithRelations } from "@/types"; // مسیر را مطابق پروژه خودت نگه دار
import formatPrice from "@/lib/utils/formatPrice";
import { getStorageUrl } from "@/lib/utils/urlUtils";

type ProductCardProps = {
  product: ProductWithRelations;
  href: string;
  priority?: boolean;
};

function ProductCard({ product, href, priority }: ProductCardProps) {
  const firstVariant = product.variants?.[0];
  if (!firstVariant) return null;

  const discountPercent = firstVariant.discountPercent ?? 0;

  const discountedPrice = Math.round(
    firstVariant.price * (1 - discountPercent / 100),
  );

  return (
    <Card className="group relative flex h-full flex-col overflow-hidden border transition-shadow hover:shadow-md">
      <Link
        href={href}
        className="relative block aspect-4/3 w-full shrink-0 overflow-hidden bg-gray-50/50"
      >
        <Image
          fill
          unoptimized={true}
          priority={priority}
          src={
            getStorageUrl(firstVariant.images?.[0]) ?? "/images/placeholder.svg"
          }
          alt={firstVariant.title}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-center transition-transform duration-300 group-hover:scale-105"
        />

        {product.category?.name && (
          <Badge className="absolute top-3 right-3 bg-white/90 text-gray-900 shadow-sm">
            {product.category.name}
          </Badge>
        )}

        {discountPercent > 0 && (
          <Badge className="absolute top-3 left-3 bg-red-500 text-white shadow-sm">
            {discountPercent}٪ تخفیف
          </Badge>
        )}
      </Link>

      <CardContent className="flex flex-1 flex-col gap-1.5 p-4">
        <CardTitle className="line-clamp-2 h-11 text-sm leading-5 font-semibold">
          <Link href={href} className="hover:text-primary transition-colors">
            {product.title}
          </Link>
        </CardTitle>

        <Rating rate={4} size={14} />

        <CardDescription className="text-muted-foreground line-clamp-1 h-5 text-xs">
          {firstVariant.title}
        </CardDescription>

        <div className="h-10">
          {product.description && (
            <p className="text-muted-foreground line-clamp-2 text-xs leading-5">
              {product.description}
            </p>
          )}
        </div>

        <div className="mt-auto pt-3">
          <div className="flex flex-col">
            {firstVariant.stock > 0 && (
              <span
                className={`text-muted-foreground text-base ${
                  discountPercent > 0 ? "text-xs line-through" : "font-semibold"
                }`}
              >
                {formatPrice(firstVariant.price)}
              </span>
            )}

            {firstVariant.stock === 0 && (
              <span className="text-base font-semibold text-red-500">
                تماس بگیرید
              </span>
            )}

            {discountPercent > 0 && (
              <span className="text-destructive text-base font-bold">
                {discountedPrice.toLocaleString("fa-IR")} تومان
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default ProductCard;
