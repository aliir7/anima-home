import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin, Phone } from "lucide-react";

function ContactPage() {
  return (
    <div className="rtl container space-y-12 px-4 py-16">
      <h1 className="text-primary text-center text-2xl font-bold md:text-4xl">
        تماس با ما
      </h1>

      <div className="grid items-start gap-12 md:grid-cols-2">
        {/* Info */}
        <div className="space-y-6 text-right">
          <p className="text-muted-foreground text-lg leading-loose sm:text-sm">
            خوشحال می‌شویم از شما بشنویم. برای هرگونه سوال، پیشنهاد یا نیاز به
            پشتیبانی، از طریق فرم زیر یا اطلاعات تماس زیر با ما در ارتباط باشید.
          </p>
          <div className="text-muted-foreground space-y-4 text-sm">
            <div className="flex items-center gap-2">
              <Mail className="text-primary h-5 w-5" />
              info@example.com
            </div>
            <div className="flex items-center gap-2">
              <Phone className="text-primary h-5 w-5" />
              ۰۲۱-۱۲۳۴۵۶۷۸
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="text-primary h-5 w-5" />
              تهران، خیابان نمونه، پلاک ۱۲۳
            </div>
          </div>
        </div>

        {/* Form */}
        <form className="space-y-4 text-right sm:text-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <Input placeholder="نام شما" className="text-right" />
            <Input
              type="email"
              placeholder="ایمیل شما"
              className="text-right"
            />
          </div>
          <Input placeholder="موضوع پیام" className="text-right" />
          <Textarea
            placeholder="متن پیام..."
            className="min-h-[120px] text-right"
          />
          <Button
            type="submit"
            className="mt-2 w-full cursor-pointer rounded-full px-4 py-2 hover:text-neutral-200 sm:mt-4 md:w-auto"
          >
            ارسال پیام
          </Button>
        </form>
      </div>
    </div>
  );
}

export default ContactPage;
