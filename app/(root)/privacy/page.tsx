import BreadcrumbSection from "@/components/shared/BreadcrumbSection";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "حریم خصوصی",
  description: "سیاست حفظ حریم خصوصی کاربران در آنیماهوم",
};

export const revalidate = 86400;

export default function PrivacyPage() {
  return (
    <section className="rtl wrapper space-y-12 px-4 py-16">
      <BreadcrumbSection
        items={[
          { label: "صفحه اصلی", href: "/" },
          { label: "حریم خصوصی", href: "/privacy" },
        ]}
      />

      <h1 className="text-primary text-center text-3xl font-bold md:text-4xl dark:text-neutral-900">
        حریم خصوصی
      </h1>

      <article className="text-muted-foreground space-y-8 text-right leading-loose dark:text-neutral-800">
        <p>
          آنیماهوم متعهد است از اطلاعات شخصی کاربران با نهایت دقت و
          مسئولیت‌پذیری محافظت کند. اطلاعات کاربران صرفاً در چارچوب ارائه خدمات،
          ثبت سفارش و پشتیبانی استفاده می‌شود.
        </p>

        <section>
          <h2 className="text-primary mb-2 text-xl font-semibold dark:text-neutral-700">
            ۱. اطلاعات جمع‌آوری‌شده
          </h2>
          <ul className="list-inside list-disc space-y-2">
            <li>نام و نام خانوادگی</li>
            <li>شماره تماس و آدرس ایمیل</li>
            <li>اطلاعات لازم برای ثبت سفارش، هماهنگی و پشتیبانی</li>
            <li>اطلاعات فنی محدود جهت بهبود تجربه کاربری (مانند کوکی‌ها)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-primary mb-2 text-xl font-semibold dark:text-neutral-700">
            ۲. نحوه استفاده از اطلاعات
          </h2>
          <p>
            اطلاعات کاربران تنها برای ارتباط با مشتری، پردازش و پیگیری سفارش‌ها،
            هماهنگی خدمات، و بهبود کیفیت تجربه کاربری استفاده می‌شود و در اختیار
            اشخاص یا سازمان‌های ثالث قرار نخواهد گرفت، مگر در مواردی که الزام
            قانونی وجود داشته باشد.
          </p>
        </section>

        <section>
          <h2 className="text-primary mb-2 text-xl font-semibold dark:text-neutral-700">
            ۳. امنیت اطلاعات و پرداخت
          </h2>
          <p>
            پرداخت‌های آنلاین از طریق درگاه‌های امن بانکی انجام می‌شود و
            آنیماهوم هیچ‌گونه اطلاعات مربوط به کارت بانکی یا حساب کاربران را
            ذخیره یا نگهداری نمی‌کند. تمامی تراکنش‌ها مطابق با استانداردهای
            امنیتی انجام می‌شود.
          </p>
        </section>

        <section>
          <h2 className="text-primary mb-2 text-xl font-semibold dark:text-neutral-700">
            ۴. حقوق کاربران
          </h2>
          <p>
            کاربران این حق را دارند که در هر زمان درخواست مشاهده، ویرایش یا حذف
            اطلاعات شخصی خود را از طریق راه‌های ارتباطی درج‌شده در وب‌سایت
            آنیماهوم ثبت کنند.
          </p>
        </section>
      </article>
    </section>
  );
}
