import BreadcrumbSection from "@/components/shared/BreadcrumbSection";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "قوانین و مقررات",
  description: "قوانین و شرایط استفاده از خدمات آنیماهوم",
};

export const revalidate = 86400;

export default function TermsPage() {
  return (
    <section className="wrapper space-y-12 px-4 py-16">
      <BreadcrumbSection
        items={[
          { label: "صفحه اصلی", href: "/" },
          { label: "قوانین و مقررات", href: "/terms" },
        ]}
      />

      <h1 className="text-primary text-center text-3xl font-bold md:text-4xl dark:text-neutral-900">
        قوانین و مقررات
      </h1>
      <article className="text-muted-foreground space-y-8 text-right leading-loose dark:text-neutral-800">
        <p>
          استفاده از وب‌سایت آنیماهوم به‌منزله پذیرش کامل قوانین و مقررات حاضر
          است. لطفاً پیش از ثبت سفارش یا استفاده از خدمات، این موارد را با دقت
          مطالعه فرمایید.
        </p>

        <section>
          <h2 className="text-primary mb-2 text-xl font-semibold dark:text-neutral-700">
            ۱. معرفی خدمات
          </h2>
          <p>
            آنیماهوم در زمینه طراحی، مشاوره، معرفی و ثبت سفارش تجهیزات مرتبط با
            دکوراسیون داخلی، کابینت آشپزخانه و یراق‌آلات وابسته فعالیت می‌کند.
            برخی خدمات و محصولات ارائه‌شده در سایت دارای ماهیت سفارشی بوده و پس
            از ثبت سفارش نهایی‌سازی می‌شوند.
          </p>
        </section>

        <section>
          <h2 className="text-primary mb-2 text-xl font-semibold dark:text-neutral-700">
            ۲. ثبت سفارش
          </h2>
          <ul className="list-inside list-disc space-y-2">
            <li>
              ثبت سفارش در وب‌سایت به‌منظور اعلام درخواست و آغاز فرآیند بررسی و
              هماهنگی نهایی انجام می‌شود.
            </li>
            <li>
              نهایی شدن سفارش ممکن است نیازمند تأیید ابعاد، مشخصات فنی یا
              هماهنگی تلفنی با مشتری باشد.
            </li>
            <li>
              در سفارش‌های دارای ماهیت سفارشی، پس از شروع فرآیند آماده‌سازی یا
              اجرا، امکان لغو سفارش وجود نخواهد داشت.
            </li>
            <li>مسئولیت ارائه اطلاعات صحیح بر عهده مشتری است.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-primary mb-2 text-xl font-semibold dark:text-neutral-700">
            ۳. پرداخت
          </h2>
          <p>
            پرداخت‌های انجام‌شده در وب‌سایت آنیماهوم به‌منظور ثبت سفارش و رزرو
            خدمات یا محصولات صورت می‌گیرد. پرداخت‌ها از طریق درگاه‌های امن بانکی
            انجام می‌شود و آنیماهوم هیچ‌گونه اطلاعات بانکی کاربران را ذخیره
            نمی‌کند.
          </p>
        </section>

        <section>
          <h2 className="text-primary mb-2 text-xl font-semibold dark:text-neutral-700">
            ۴. تغییر قوانین
          </h2>
          <p>
            آنیماهوم حق دارد در هر زمان قوانین و مقررات را به‌روزرسانی کند. نسخه
            جدید از طریق همین صفحه در دسترس خواهد بود.
          </p>
        </section>
      </article>
    </section>
  );
}
