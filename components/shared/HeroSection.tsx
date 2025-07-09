import Image from "next/image";
import heroImg from "../../public/images/hero.png";

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
          <h2 className="text-xl font-semibold text-white drop-shadow-lg md:text-3xl md:text-neutral-950">
            آنیما هوم یعنی، خانه‌ای با روح
          </h2>
          <p className="mt-3 text-sm text-white drop-shadow md:text-base md:text-neutral-950">
            سادگی، زیبایی و حس خوب
          </p>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
