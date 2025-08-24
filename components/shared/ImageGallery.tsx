"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

type ImageGalleryProps = {
  images: string[];
  title?: string;
};

function ImageGallery({ images, title }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const selectedImage = selectedIndex !== null ? images[selectedIndex] : null;

  const closeLightbox = () => setSelectedIndex(null);

  // ESC key to close
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  const showPrev = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((prev) => (prev! > 0 ? prev! - 1 : images.length - 1));
    }
  };

  const showNext = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((prev) => (prev! < images.length - 1 ? prev! + 1 : 0));
    }
  };

  return (
    <>
      {/* Grid of thumbnails */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {images.map((img, idx) => (
          <div
            key={idx}
            onClick={() => setSelectedIndex(idx)}
            className="relative cursor-zoom-in overflow-hidden rounded-lg border"
          >
            <Image
              src={img}
              alt={`تصویر ${idx + 1}`}
              width={500}
              height={500}
              unoptimized
              className="h-48 w-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Lightbox fullscreen */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-50 rounded-full bg-white/80 p-2 hover:bg-white"
          >
            <X className="h-6 w-6 text-black" />
          </button>

          {/* Title */}
          {title && (
            <h2 className="absolute top-4 left-1/2 -translate-x-1/2 text-lg font-semibold text-white">
              {title}
            </h2>
          )}

          {/* Prev Button */}
          <button
            onClick={showPrev}
            className="absolute top-1/2 left-4 z-50 -translate-y-1/2 rounded-full bg-white/80 p-2 hover:bg-white"
          >
            <ChevronLeft className="h-6 w-6 text-black" />
          </button>

          {/* Image */}
          <div className="max-h-[90vh] max-w-[90vw] overflow-hidden rounded-lg">
            <TransformWrapper>
              <TransformComponent>
                <Image
                  src={selectedImage}
                  alt="پیش‌نمایش"
                  width={1200}
                  height={800}
                  unoptimized
                  className="max-h-[90vh] w-auto object-contain"
                />
              </TransformComponent>
            </TransformWrapper>
          </div>

          {/* Next Button */}
          <button
            onClick={showNext}
            className="absolute top-1/2 right-4 z-50 -translate-y-1/2 rounded-full bg-white/80 p-2 hover:bg-white"
          >
            <ChevronRight className="h-6 w-6 text-black" />
          </button>
        </div>
      )}
    </>
  );
}

export default ImageGallery;
