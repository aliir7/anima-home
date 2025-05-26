import BenefitsSection from "@/components/shared/BenefitsSection";
import BlogSection from "@/components/shared/BlogSection";
import HeroSection from "@/components/shared/HeroSection";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "صفحه اصلی",
};

export default function HomePage() {
  return (
    <div className="space-y-6">
      <HeroSection />

      <BenefitsSection />
      <BlogSection />
    </div>
  );
}
