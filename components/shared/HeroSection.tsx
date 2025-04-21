import Link from "next/link";
import Image from "next/image";
import heroImg from "../../public/images/hero.jpg";
function HeroSection() {
  return (
    <section className="bg-muted px-4 py-10 md:px-8">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 md:grid-cols-2">
        <div>
          <h2 className="text-primary mb-4 text-3xl font-bold md:text-4xl">
            طراحی خانه‌ای که دوستش دارید
          </h2>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            با محصولات منحصر به‌فرد ما، زیبایی و عملکرد را به خانه خود بیاورید.
          </p>
          <Link href="/products">
            <span className="bg-primary hover:bg-primary/80 inline-block rounded-xl px-6 py-3 text-white transition">
              مشاهده محصولات
            </span>
          </Link>
        </div>
        <div className="flex justify-center">
          <Image
            src={heroImg}
            alt="طراحی داخلی"
            width={500}
            height={300}
            className="rounded-xl object-cover shadow-lg"
          />
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
