"use client";

import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

const banners = ["/banners/1.jpg", "/banners/2.jpg", "/banners/3.jpg"];

function CarouselBanner() {
  return (
    <div className="relative mx-auto mt-8 w-full max-w-screen-xl overflow-hidden rounded-2xl shadow-md">
      <Carousel>
        <CarouselContent>
          {banners.map((src, index) => (
            <CarouselItem
              key={index}
              className="relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px]"
            >
              <Image
                src={src}
                alt={`بنر ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority={index === 0}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4" />
        <CarouselNext className="right-4" />
      </Carousel>
    </div>
  );
}
export default CarouselBanner;
