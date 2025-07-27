"use client";

import { useState } from "react";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

type ImageGalleryProps = {
  images: string[];
};

function ImageGallery({ images }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {images.map((img, idx) => (
          <img
            key={idx}
            src={img}
            alt={`project image ${idx + 1}`}
            onClick={() => setSelectedImage(img)}
            className="cursor-zoom-in rounded-lg border transition hover:opacity-90"
          />
        ))}
      </div>

      {/* بزرگنمایی در modal */}
      <Dialog
        open={!!selectedImage}
        onOpenChange={() => setSelectedImage(null)}
      >
        <DialogTitle></DialogTitle>
        <DialogContent className="max-w-4xl">
          {selectedImage && (
            <img
              src={selectedImage}
              alt="نمایش بزرگ تصویر"
              className="h-auto w-full rounded-lg"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ImageGallery;
