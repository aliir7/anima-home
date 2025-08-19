import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin, Phone } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "تماس با ما",
};

export const revalidate = 86400; // 1 day

function ContactPage() {
  return (
    <div className="rtl container space-y-12 px-4 py-16">
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
              تهران، خیابان نمونه، پلاک ۱۲۳
            </div>
          </div>
        </div>

        {/* Form */}
        <form className="mx-4 space-y-4 text-right sm:text-sm">
          <div className="grid gap-4 md:grid-cols-2 dark:text-neutral-400">
            <Input
              placeholder="نام شما"
              className="outline-light dark:outline-dark rounded-full text-right dark:border-neutral-600"
            />
            <Input
              type="email"
              placeholder="ایمیل شما"
              className="outline-light dark:outline-dark rounded-full text-right dark:border-neutral-600"
            />
          </div>
          <Input
            placeholder="موضوع پیام"
            className="outline-light dark:outline-dark rounded-full text-right dark:border-neutral-600"
          />
          <Textarea
            placeholder="متن پیام..."
            className="outline-light dark:outline-dark min-h-[120px] text-right dark:border-neutral-600"
          />
          <Button
            type="submit"
            className="outline-light dark:outline-dark mt-2 w-full cursor-pointer rounded-full px-4 py-2 hover:text-neutral-200 active:text-neutral-200 sm:mt-4 md:w-auto dark:hover:text-neutral-700 dark:active:text-neutral-700"
          >
            ارسال پیام
          </Button>
        </form>
      </div>
    </div>
  );
}

export default ContactPage;
