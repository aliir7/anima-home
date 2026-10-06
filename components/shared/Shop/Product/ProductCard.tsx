"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Rating from "@/components/ui/Rating";
import formatPrice from "@/lib/utils/formatPrice";
import { getStorageUrl } from "@/lib/utils/urlUtils";
import type { ProductWithRelations } from "@/types"; // مسیر را مطابق پروژه خودت نگه دار
import Image from "next/image";
import Link from "next/link";

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

  const imageUrl =
    getStorageUrl(firstVariant.images?.[0]) ?? "/images/placeholder.svg";

  const isOutOfStock = firstVariant.stock === 0;

  return (
    <Card className="group bg-background flex h-full min-h-130 flex-col overflow-hidden rounded-3xl border shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
      {/* Image */}
      <Link
        href={href}
        aria-label={product.title}
        className="bg-muted/30 relative block aspect-4/3 w-full shrink-0 overflow-hidden"
      >
        <Image
          fill
          unoptimized
          priority={priority}
          src={imageUrl}
          alt={firstVariant.title}
          sizes="
            (max-width: 640px) 100vw,
            (max-width: 1024px) 50vw,
            33vw
          "
          className="object-contain object-center p-3 transition-transform duration-500 ease-out group-hover:scale-[1.03]"
        />

        {/* Category */}
        {product.category?.name && (
          <Badge className="absolute top-4 right-4 z-10 max-w-[42%] truncate rounded-full border-0 bg-white/95 px-3.5 py-2 text-xs font-medium text-gray-900 shadow-md backdrop-blur-sm">
            {product.category.name}
          </Badge>
        )}

        {/* Discount */}
        {discountPercent > 0 && (
          <Badge className="absolute top-4 left-4 z-10 rounded-full border-0 bg-red-500 px-3 py-1.5 text-xs font-semibold text-white shadow-md">
            {discountPercent}٪ تخفیف
          </Badge>
        )}
      </Link>

      <CardContent className="flex flex-1 flex-col p-5">
        {/* Title + Rating */}
        <div className="flex items-start gap-3">
          <Link href={href} className="min-w-0 flex-1">
            <h3 className="group-hover:text-primary line-clamp-2 min-h-11 text-lg leading-5 font-bold transition-colors sm:leading-6 md:text-sm">
              {product.title}
            </h3>
          </Link>

          <div className="flex shrink-0 items-center gap-1">
            <Rating rate={5} size={14} />
          </div>
        </div>

        {/* Variant */}

        {/* Description */}
        <div className="mt-2 h-10">
          {product.description && (
            <p className="text-muted-foreground line-clamp-2 text-sm leading-5">
              {product.shortDescription}
            </p>
          )}
        </div>

        {/* Divider */}
        <div className="my-5 border-t" />

        {/* Bottom */}
        <div className="mt-auto flex items-center gap-3">
          {/* Price */}
          <div className="min-w-0 flex-1 overflow-hidden">
            {isOutOfStock ? (
              <span className="block text-xs font-semibold whitespace-nowrap text-red-500 lg:text-sm">
                تماس بگیرید
              </span>
            ) : discountPercent > 0 ? (
              <div className="flex min-w-0 flex-col">
                <span className="text-muted-foreground text-[10px] whitespace-nowrap line-through">
                  {formatPrice(firstVariant.price)}
                </span>

                <div className="flex items-baseline gap-1 whitespace-nowrap">
                  <span className="text-destructive text-sm font-bold lg:text-base">
                    {discountedPrice.toLocaleString("fa-IR")}
                  </span>

                  <span className="text-muted-foreground text-[10px]">
                    تومان
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex items-baseline gap-1 whitespace-nowrap">
                <span className="text-sm font-bold lg:text-base">
                  {formatPrice(firstVariant.price)}
                </span>
              </div>
            )}
          </div>

          {/* Button */}
          <Link
            href={href}
            className="bg-primary text-primary-foreground flex h-11 shrink-0 items-center justify-center rounded-full px-5 text-sm font-medium whitespace-nowrap transition-all duration-300 group-hover:shadow-md hover:opacity-90 sm:px-6"
          >
            مشاهده محصول
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default ProductCard;
