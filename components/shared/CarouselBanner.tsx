"use client";

import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const banners = ["/banners/1.jpg", "/banners/2.jpg", "/banners/3.jpg"];

function CarouselBanner() {
  return <Carousel></Carousel>;
}
export default CarouselBanner;
