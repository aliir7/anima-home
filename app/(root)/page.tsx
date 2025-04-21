import CarouselBanner from "@/components/shared/CarouselBanner";
import HeroSection from "@/components/shared/HeroSection";
import ProductList from "@/components/shared/Product/ProductList";
import sampleData from "@/db/sampleData";

export default function HomePage() {
  return (
    <div className="space-y-12">
      <CarouselBanner />
      <HeroSection />
      <ProductList data={sampleData.products} />
    </div>
  );
}
