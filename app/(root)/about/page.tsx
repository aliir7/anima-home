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
          همه‌چیز از کارگاه کوچک و کم‌نور پدربزرگم شروع شد. جایی که بوی خاک‌اره،
          صدای ارّه‌ی دستی، و نورِ کمِ لامپ زرد، بخشی از حال‌وهوای هر روز بودن.
          او یک نجار واقعی بود—نه فقط با دست‌هایی پینه‌بسته و ابزارهایی قدیمی،
          بلکه با نگاهی عمیق به چوب. برای پدربزرگم، هر تخته چوب یه موجود زنده
          بود که باید باهاش گفت‌وگو می‌کرد.
          <br />
          وقتی نوبت به پدرم رسید، این عشق به ساختن با دنیای مدرن گره خورد. او
          یاد گرفت چطور از چوب‌های سنتی به سمت مصنوعات چوبی مثل MDF حرکت کنه و
          نسل خودش رو با ابزارها و متریال‌های جدید هماهنگ کرد. من وارد این حرفه
          شدم وقتی پدرم دیگه یه اوستاکار کامل بود. بیشتر از ۱۵ ساله که کنار اون
          کار می‌کنم—نه فقط کار، بلکه رشد، یادگیری، و پشت سر گذاشتن پروژه‌های
          سخت و سنگین، یکی پس از دیگری. توی این سال‌ها، باهم پروژه‌هایی رو انجام
          دادیم که بعضی‌هاش واقعاً مثل مأموریت غیرممکن بودن. از شمال تا جنوب
          تهران، از شرق تا غرب، تقریباً در تمام مناطق تهران ردّی از کار ما هست.
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
