import ContactForm from "@/components/shared/Account/ContactForm";
import BreadcrumbSection from "@/components/shared/BreadcrumbSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin, Phone } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "تماس با ما",
  description: "اطلاعات تماس و ارتباط با آنیماهوم",
};

export const revalidate = 86400; // 1 day

function ContactPage() {
  return (
    <section className="rtl wrapper space-y-12 px-4 py-16">
      <BreadcrumbSection
        items={[
          { label: "صفحه اصلی ", href: "/" },
          { label: "تماس با ما", href: "/contact" },
        ]}
      />
      <h1 className="text-primary pb-4 text-center text-2xl font-bold md:text-4xl dark:text-neutral-900">
        تماس با ما
      </h1>

      <div className="grid items-start gap-12 md:grid-cols-2">
        {/* Info */}
        <div className="mx-4 space-y-6 text-right">
          <p className="text-muted-foreground text-lg leading-loose sm:text-sm dark:text-neutral-800">
            خوشحال می‌شویم از شما بشنویم. برای هرگونه سوال، پیشنهاد یا نیاز به
            پشتیبانی، از طریق فرم زیر یا اطلاعات تماس زیر با ما در ارتباط باشید.
          </p>
          <div className="text-muted-foreground space-y-4 text-sm">
            <div className="flex items-center gap-2 dark:text-neutral-700">
              <Mail className="text-primary h-5 w-5 dark:text-neutral-400" />
              info@anima-home.ir
            </div>
            <div className="flex items-center gap-2 dark:text-neutral-700">
              <Phone className="text-primary h-5 w-5 dark:text-neutral-400" />
              09128184930
              <br />
              09129277302
            </div>
            <div className="flex items-center gap-2 dark:text-neutral-700">
              <MapPin className="text-primary h-5 w-5 dark:text-neutral-400" />
              <address>تهران، شهرک صنعتی چهاردانگه خیابان بیست و چهارم</address>
            </div>
          </div>
        </div>

        {/* Form */}
        <ContactForm />
      </div>
    </section>
  );
}

export default ContactPage;
