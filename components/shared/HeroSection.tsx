import Image from "next/image";
import heroImg from "../../public/images/hero.png";

function HeroSection() {
  return (
    <section className="bg-background text-foreground dark:bg-muted relative w-full overflow-hidden rounded-lg">
      {/* تصویر */}
      <Image
        src={heroImg}
        alt="hero-image"
        height={600}
        priority
        className="w-full object-cover"
      />

      {/* لایه تیره نیمه شفاف */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

      {/* متن روی تصویر */}
      <div className="absolute inset-0 top-3/4 bottom-1/3 flex items-center justify-center md:top-1/2 md:bottom-1/3">
        <div className="relative z-20 max-w-xl px-4 text-center">
          <h2 className="text-md font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] md:text-4xl">
            آنیما هوم یعنی، خانه‌ای با روح
          </h2>
          <p className="mt-2 text-xs text-white/90 drop-shadow-[0_1px_3px_rgba(0,0,0,0.7)] md:mt-4 md:text-lg">
            سادگی، زیبایی و حس خوب
          </p>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
