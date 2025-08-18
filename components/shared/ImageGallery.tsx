"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { Button } from "@/components/ui/button";

type ImageGalleryProps = {
  images: string[];
  title?: string;
};

function ImageGallery({ images, title }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const selectedImage = selectedIndex !== null ? images[selectedIndex] : null;

  const closeModal = () => setSelectedIndex(null);

  // ESC key to close
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  // Navigation handlers
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
              priority={false}
              className="h-48 w-full object-cover"
              placeholder="blur"
              blurDataURL={img}
            />
          </div>
        ))}
      </div>

      {/* Dialog for full screen preview */}
      <Dialog open={!!selectedImage} onOpenChange={closeModal}>
        <DialogContent className="w-full max-w-5xl rounded-lg bg-white p-2 sm:p-4">
          <DialogTitle className="text-primary my-2 mr-2.5 px-6 py-2 text-lg dark:text-neutral-700">
            {title ?? ""}
          </DialogTitle>
          {selectedImage && (
            <div className="relative flex h-[70vh] w-full items-center justify-center overflow-hidden rounded-lg bg-white">
              {/* Previous Button */}
              <Button
                variant="ghost"
                onClick={showPrev}
                className="hover:bg-muted absolute top-1/2 left-2 z-10 -translate-y-1/2 rounded-full bg-white shadow-md"
                size="icon"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>

              {/* Zoomable image */}
              <TransformWrapper>
                <TransformComponent>
                  <Image
                    src={selectedImage}
                    alt="پیش‌نمایش بزرگ"
                    width={1200}
                    height={800}
                    unoptimized
                    placeholder="blur"
                    blurDataURL={selectedImage}
                    priority={false}
                    className="max-h-[70vh] w-auto object-contain"
                  />
                </TransformComponent>
              </TransformWrapper>

              {/* Next Button */}
              <Button
                variant="ghost"
                onClick={showNext}
                className="hover:bg-muted absolute z-10 top-1/2 right-2 -translate-y-1/2 rounded-full bg-white shadow-md"
                size="icon"
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ImageGallery;
