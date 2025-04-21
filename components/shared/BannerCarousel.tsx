"use client";

import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";

function BannerCarousel() {
  const banners: string[] = [
    "/public/banners/1.jpg",
    "/public/banners/2.jpg",
    "/public/banners/3.jpg",
  ];

  return (
    <div className="relative h-64 w-full bg-gray-300">
      <Carousel>
        <CarouselContent>
          {banners.map((src, index) => (
            <CarouselItem key={index} className="relative h-64 w-full">
              <Image
                src={src}
                alt={`بنر ${index + 1}`}
                fill
                className="rounded-md object-cover"
                priority={index === 0}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="text-white" />
        <CarouselNext className="text-white" />
      </Carousel>
    </div>
  );
}

export default BannerCarousel;
