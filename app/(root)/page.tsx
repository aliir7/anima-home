import CabinetOfferSection from "@/components/shared/CabinetOfferSection";
import Divider from "@/components/shared/Divider";
import HeroSection from "@/components/shared/HeroSection";
import ServicesSection from "@/components/shared/Services/ServicesSection";
import { APP_DESCRIPTION } from "@/lib/constants";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "صفحه اصلی",
  description: `${APP_DESCRIPTION}`,
};

export const revalidate = 86400; // 1day

export default function HomePage() {
  return (
    <div className="space-y-12 md:space-y-6">
      <HeroSection />
      <Divider text="خدمات ما" />
      <ServicesSection />
      <Divider text="   " />
      <CabinetOfferSection />
    </div>
  );
}
