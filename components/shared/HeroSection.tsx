import Link from "next/link";
import Image from "next/image";
import heroImg from "../../public/images/hero.png";
import { Button } from "../ui/button";
function HeroSection() {
  return (
    <section className="bg-background text-foreground dark:bg-muted relative w-full rounded-lg">
      <Image
        src={heroImg}
        alt="hero-image"
        height={600}
        priority={true}
        className="w-full bg-transparent object-cover"
      />
      <div className="absolute inset-0 top-1/3 z-10 flex items-center justify-center md:top-1/2">
        <div className="relative z-20 max-w-xl px-4 text-center">
          <h2 className="text-xl font-semibold text-white drop-shadow-lg md:text-2xl md:text-neutral-950 dark:text-white">
            طراحی داخلی مطابق با سبک و سلیقه شما
          </h2>
          <p className="mt-3 text-sm text-white drop-shadow md:text-base md:text-neutral-950 dark:text-white">
            با انیماهوم خانه رویایی بسازید
          </p>

          <Button
            asChild
            variant="default"
            className="bg-primary hover:bg-hoverBtn mt-8 rounded-full px-6 py-4 text-sm font-semibold text-white transition md:px-8 md:py-6 dark:bg-neutral-950 dark:hover:bg-neutral-800"
          >
            <Link href="" target="_blank">
              دریافت مشاوره
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
