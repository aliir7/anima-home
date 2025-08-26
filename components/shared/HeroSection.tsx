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
      <div className="absolute inset-0 top-3/5 z-10 flex items-center justify-center md:top-1/2">
        <div className="relative z-20 max-w-xl px-4 text-center">
          <h2 className="text-lg font-semibold text-emerald-900 drop-shadow-lg md:text-3xl">
            آنیما هوم یعنی، خانه‌ای با روح
          </h2>
          <p className="mt-1 text-sm text-emerald-950 drop-shadow md:mt-3 md:text-base">
            سادگی، زیبایی و حس خوب
          </p>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
