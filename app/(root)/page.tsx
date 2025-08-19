import CabinetOfferSection from "@/components/shared/CabinetOfferSection";
import HeroSection from "@/components/shared/HeroSection";
import ServicesSection from "@/components/shared/Services/ServicesSection";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "صفحه اصلی",
};

export const revalidate = 86400; // 1day

export default function HomePage() {
  return (
    <div className="space-y-12 md:space-y-6">
      <HeroSection />
      <ServicesSection />
      <CabinetOfferSection />
    </div>
  );
}
