import { Metadata } from "next";

export const metadata: Metadata = {
  title: "درباره ما",
};

function AboutPage() {
  return (
    <div className="rtl container space-y-12 px-4 py-16">
      <h1 className="text-primary py-4 text-center text-3xl font-bold md:text-4xl dark:text-neutral-900">
        درباره ما
      </h1>

      <div className="text-muted-foreground space-y-6 px-4 pb-4 text-right leading-loose dark:text-neutral-800">
        <p>
          ما یک تیم خلاق و باانگیزه هستیم که با هدف ارائه بهترین تجربه خرید
          آنلاین برای شما فعالیت می‌کنیم. هدف ما ارائه محصولاتی باکیفیت، طراحی
          زیبا و پشتیبانی حرفه‌ای است.
        </p>
        <p>
          از ابتدا با تمرکز بر نیازهای کاربران، تلاش کرده‌ایم بستری ساده، امن و
          در عین حال جذاب برای خرید اینترنتی فراهم کنیم. ما باور داریم رضایت
          شما، سرمایه‌ی اصلی ماست.
        </p>
        <p>
          تیم ما متشکل از طراحان، توسعه‌دهندگان و پشتیبانانی حرفه‌ای است که هر
          روز برای بهتر شدن تلاش می‌کنند. اگر پیشنهادی برای بهبود خدمات ما
          دارید، خوشحال می‌شویم بشنویم.
        </p>
      </div>

      <div className="mt-4 grid gap-6 pt-6 text-center md:grid-cols-3">
        <div className="bg-muted rounded-xl p-6 shadow-sm">
          <p className="text-primary text-4xl font-bold">+۵ سال</p>
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
    </div>
  );
}

export default AboutPage;
