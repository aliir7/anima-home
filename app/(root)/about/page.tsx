import BreadcrumbSection from "@/components/shared/BreadcrumbSection";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "درباره ما",
};

export const revalidate = 86400; // 1 day

function AboutPage() {
  return (
    <section className="rtl wrapper space-y-12 px-4 py-16">
      <BreadcrumbSection
        items={[
          { label: "صفحه اصلی", href: "/" },
          { label: "درباره ما", href: "/about" },
        ]}
      />
      <h1 className="text-primary py-4 text-center text-3xl font-bold md:text-4xl dark:text-neutral-900">
        درباره ما
      </h1>

      <div className="text-muted-foreground space-y-6 px-4 pb-4 text-right leading-loose dark:text-neutral-800">
        <p>
          همه‌چیز از کارگاه کوچک و کم‌نور پدربزرگم شروع شد. جایی که بوی
          خاک‌ارّه‌، صدای ارّه‌ی دستی، و نورِ کمِ لامپ زرد، بخشی از حال‌وهوای هر
          روز بودن. او یک نجار واقعی بود—نه فقط با دست‌هایی پینه‌بسته و
          ابزارهایی قدیمی، بلکه با نگاهی عمیق به چوب. برای پدربزرگم، هر تخته چوب
          یه موجود زنده بود که باید باهاش گفت‌وگو می‌کرد.
          <br />
          وقتی نوبت به پدرم رسید، این عشق به ساختن با دنیای مدرن گره خورد. او
          یاد گرفت چطور از چوب‌های سنتی به سمت مصنوعات چوبی مثل MDF حرکت کنه و
          نسل خودش رو با ابزارها و متریال‌های جدید هماهنگ کرد. من وارد این حرفه
          شدم وقتی پدرم دیگه یه اوستاکار کامل بود. بیشتر از ۱۵ ساله که کنار اون
          کار می‌کنم — نه فقط کار، بلکه رشد، یادگیری، و پشت سر گذاشتن پروژه‌های
          سخت و سنگین، یکی پس از دیگری. توی این سال‌ها، باهم پروژه‌هایی رو انجام
          دادیم که بعضی‌هاش واقعاً مثل مأموریت غیرممکن بودن. از شمال تا جنوب
          تهران، از شرق تا غرب، تقریباً در تمام مناطق تهران ردی از کار ما هست.
        </p>
        <p>
          اما مسیر ما فقط به تهران محدود نشد؛ گاهی سفارش‌هایی از دل شهرهای دور
          رسید، گاهی پروژه‌هایی که نیاز به تخصص و اعتماد داشتن، ما رو به نقاط
          مختلف کشور کشوند. از خونه‌های شخصی تا فضاهای عمومی، هرجا که نیاز به
          طراحی دقیق و اجرای تمیز بود، ما با همه‌ی توانمون وارد شدیم.
          <br />
          امروز ما یک تیم حرفه‌ای هستیم—تیمی که ریشه‌هاش به سه نسل تجربه در کار
          با چوب و مصنوعات چوبی برمی‌گرده. من سال‌ها کنار پدرم، با صدای ارّه،
          بوی MDF، و متر و دریل و پیچ‌گوشتی بزرگ شدم، و امروز بیشتر از همیشه
          می‌دونم که کیفیت، فقط توی ابزار و متریال نیست، توی دل و دقتیه که برای
          هر پروژه می‌ذاری.
          <br />
          حالا کنار پدرم که هنوز با همون دقت و عشق سابق کار می‌کنه، من هم تلاش
          می‌کنم تا تجربه‌هامون رو به نسل امروز منتقل کنم. و نگاه برادرم به
          دنیای دیجیتال، کمکمون کرده تا این مسیر سنتی رو با ابزارهای امروزی زنده
          نگه داریم
        </p>
        <p>
          در رابطه‌ی ما با مشتری‌هامون فقط یک قرارداد کاری نیست؛ برای خیلی از
          اون‌ها، این همکاری به دوستی‌های ماندگار تبدیل شده. این صمیمیت و احترام
          متقابل، همیشه بخشی جدایی‌ناپذیر از هویت کاری ما بوده — و خواهد بود.
        </p>
      </div>

      <div className="mt-4 grid gap-6 pt-6 text-center md:grid-cols-3">
        <div className="bg-muted rounded-xl p-6 shadow-sm">
          <p className="text-primary text-4xl font-bold">+1۵ سال</p>
          <p className="text-muted-foreground mt-2 text-sm">سابقه فعالیت</p>
        </div>
        <div className="bg-muted rounded-xl p-6 shadow-sm">
          <p className="text-primary text-4xl font-bold">+۲۰۰</p>
          <p className="text-muted-foreground mt-2 text-sm">مشتری وفادار</p>
        </div>
        <div className="bg-muted rounded-xl p-6 shadow-sm">
          <p className="text-primary text-4xl font-bold">+۱۰۰۰</p>
          <p className="text-muted-foreground mt-2 text-sm">سفارش موفق</p>
        </div>
      </div>
    </section>
  );
}

export default AboutPage;
