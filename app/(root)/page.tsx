import HeroSection from "@/components/shared/HeroSection";
import ServicesSection from "@/components/shared/ServicesSection";
import BlogSection from "@/components/shared/BlogSection";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "صفحه اصلی",
};

export default function HomePage() {
  return (
    <div className="space-y-6">
      <HeroSection />
      <ServicesSection />
      <BlogSection />
    </div>
  );
}
