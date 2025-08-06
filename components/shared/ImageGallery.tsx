"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import Image from "next/image";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

type ImageGalleryProps = {
  images: string[];
};

function ImageGallery({ images }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {images.map((img, idx) => (
          <div
            key={idx}
            className="relative cursor-zoom-in overflow-hidden rounded-lg border transition hover:opacity-90"
            onClick={() => setSelectedImage(img)}
          >
            <Image
              src={img}
              alt={`project image ${idx + 1}`}
              width={500}
              height={500}
              className="h-max w-max object-fill"
            />
          </div>
        ))}
      </div>

      {/* بزرگنمایی در modal */}
      <Dialog
        open={!!selectedImage}
        onOpenChange={() => setSelectedImage(null)}
      >
        <DialogContent className="max-w-4xl">
          <DialogTitle />
          {selectedImage && (
            <div className="h-[80vh] w-full overflow-hidden rounded-md">
              <TransformWrapper
                initialScale={1}
                minScale={1}
                maxScale={5}
                wheel={{ disabled: false }}
                doubleClick={{ disabled: false }}
                pinch={{ disabled: false }}
                panning={{ disabled: false }}
              >
                <TransformComponent>
                  <Image
                    src={selectedImage}
                    alt="نمایش بزرگ تصویر"
                    width={1200}
                    height={800}
                    className="mx-auto h-full w-auto object-contain"
                  />
                </TransformComponent>
              </TransformWrapper>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ImageGallery;
