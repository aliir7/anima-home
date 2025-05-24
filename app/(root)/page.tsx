import BenefitsSection from "@/components/shared/BenefitsSection";
import HeroSection from "@/components/shared/HeroSection";

export default function HomePage() {
  return (
    <div className="space-y-6">
      {/* <CarouselBanner /> */}
      <HeroSection />
      <BenefitsSection />
    </div>
  );
}
