import ContactForm from "@/components/shared/Account/ContactForm";
import BreadcrumbSection from "@/components/shared/BreadcrumbSection";
import SocialLinks from "@/components/shared/Footer/SocialLinks";
import { Mail, MapPin, Phone } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "تماس با ما",
  description: "اطلاعات تماس و راه‌های ارتباط با آنیماهوم",
};

export const revalidate = 86400;

function ContactPage() {
  return (
    <section className="wrapper rtl space-y-12 px-4 py-16">
      <BreadcrumbSection
        items={[
          { label: "صفحه اصلی", href: "/" },
          { label: "تماس با ما", href: "/contact" },
        ]}
      />

      {/* Hero */}
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-primary text-2xl font-bold md:text-3xl dark:text-neutral-950">
          ارتباط با آنیماهوم
        </h1>

        <p className="text-muted-foreground mt-5 text-xs leading-6 md:text-lg md:leading-8 dark:text-neutral-800">
          اگر درباره طراحی و اجرای کابینت، دکوراسیون داخلی، ثبت سفارش یا همکاری
          با آنیماهوم سوالی دارید، خوشحال می‌شویم پاسخگوی شما باشیم. از طریق فرم
          تماس یا اطلاعات ارتباطی زیر، پیام خود را برای ما ارسال کنید.
        </p>
      </div>

      <div className="grid items-start gap-8 lg:grid-cols-[420px_1fr]">
        {/* Contact Info */}
        <aside className="bg-card space-y-6 rounded-3xl border p-6 shadow-sm">
          <div>
            <h2 className="text-foreground text-lg font-bold">اطلاعات تماس</h2>

            <p className="text-muted-foreground mt-2 text-sm leading-7">
              تیم آنیماهوم در سریع‌ترین زمان ممکن پاسخگوی سوالات، درخواست‌ها و
              پیام‌های شما خواهد بود.
            </p>
          </div>

          <div className="space-y-5">
            <div className="flex items-start gap-3">
              <div className="bg-primary/10 text-primary rounded-full p-2">
                <Mail size={18} />
              </div>

              <div>
                <p className="text-sm font-semibold">ایمیل</p>
                <a
                  href="mailto:info@anima-home.ir"
                  className="text-muted-foreground hover:text-primary text-sm transition-colors"
                >
                  info@anima-home.ir
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-primary/10 text-primary rounded-full p-2">
                <Phone size={18} />
              </div>

              <div className="space-y-1 text-sm">
                <p className="font-semibold">شماره تماس</p>

                <a
                  href="tel:09128184930"
                  className="text-muted-foreground hover:text-primary block transition-colors"
                >
                  09128184930
                </a>

                <a
                  href="tel:09129277302"
                  className="text-muted-foreground hover:text-primary block transition-colors"
                >
                  09129277302
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-primary/10 text-primary rounded-full p-2">
                <MapPin size={18} />
              </div>

              <div>
                <p className="text-sm font-semibold">آدرس</p>

                <address className="text-muted-foreground text-sm leading-7 not-italic">
                  تهران، شهرک صنعتی چهاردانگه،
                  <br />
                  خیابان بیست و چهارم
                </address>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <SocialLinks isFooter={false} />
          </div>
        </aside>

        {/* Contact Form */}
        <div className="bg-card rounded-3xl border p-6 shadow-sm md:p-8">
          <div className="mb-6">
            <h2 className="text-foreground text-lg font-bold">فرم تماس</h2>

            <p className="text-muted-foreground mt-2 text-sm leading-7">
              برای دریافت مشاوره، ثبت سفارش یا ارسال پیشنهاد و انتقاد، فرم زیر
              را تکمیل کنید. کارشناسان ما در اولین فرصت با شما تماس خواهند گرفت.
            </p>
          </div>

          <ContactForm />
        </div>
      </div>
    </section>
  );
}

export default ContactPage;
