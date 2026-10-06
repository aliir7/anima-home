"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type ProductImagesProps = {
  images: string[];
  productTitle?: string;
};

function ProductImages({ images, productTitle = "محصول" }: ProductImagesProps) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    setCurrent(0);
  }, [images]);

  if (images.length === 0) {
    return (
      <div className="bg-muted/30 flex aspect-square w-full items-center justify-center rounded-2xl border">
        <span className="text-muted-foreground text-sm">
          تصویری برای این محصول وجود ندارد
        </span>
      </div>
    );
  }

  const currentImage = images[current];

  return (
    <div className="flex flex-col gap-4 md:flex-row-reverse md:items-start">
      {/* Main Image */}
      <div className="bg-muted/20 flex min-w-0 flex-1 items-center justify-center rounded-2xl border p-4 sm:p-6">
        <div className="relative aspect-square w-full max-w-100 overflow-hidden rounded-xl">
          <Image
            src={currentImage}
            alt={`${productTitle} - تصویر ${current + 1}`}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 400px"
            className="object-contain transition-transform duration-300 hover:scale-[1.02]"
          />
        </div>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex shrink-0 gap-3 overflow-x-auto px-1 pb-1 md:w-19 md:flex-col md:overflow-x-visible md:overflow-y-auto md:px-0 md:pb-0">
          {images.map((image, index) => {
            const isActive = index === current;

            return (
              <button
                key={`${image}-${index}`}
                type="button"
                onClick={() => setCurrent(index)}
                aria-label={`نمایش تصویر ${index + 1}`}
                aria-current={isActive ? "true" : undefined}
                className={`bg-muted/20 relative size-16 shrink-0 overflow-hidden rounded-xl border-2 transition-all duration-200 md:size-17 ${
                  isActive
                    ? "border-primary ring-primary/15 ring-2"
                    : "hover:border-primary/40 border-transparent"
                }`}
              >
                <Image
                  src={image}
                  alt={`${productTitle} - تصویر کوچک ${index + 1}`}
                  fill
                  sizes="68px"
                  className="object-contain p-1"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ProductImages;
