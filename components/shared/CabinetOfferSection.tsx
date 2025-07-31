"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils/utils";

export default function CabinetOfferSection() {
  const [open, setOpen] = useState(false);

  return (
    <section className="bg-muted/40 mx-auto mt-10 max-w-4xl rounded-3xl px-6 py-10 shadow-lg">
      <h2 className="mb-4 text-center text-2xl font-bold">
        🛠️ پکیج خدمات اقتصادی کابینت
      </h2>

      <p className="text-muted-foreground mb-6 text-center">
        راه‌حلی ساده و مقرون‌به‌صرفه برای نوسازی آشپزخانه شما بدون تخریب!
      </p>

      <div
        className={cn(
          "transition-all duration-300",
          open
            ? "max-h-fit"
            : "pointer-events-none max-h-[120px] overflow-hidden blur-sm select-none",
        )}
      >
        <div dir="rtl" className="space-y-4 text-sm leading-7">
          <p>
            در بازار امروز، نوسازی کامل کابینت‌ها هزینه‌بر و زمان‌بر شده. ما در{" "}
            <strong>آنیما هوم</strong> با طراحی یک پکیج خدماتی اقتصادی و تخصصی،
            به شما کمک می‌کنیم بدون تخریب و با کم‌ترین هزینه، ظاهر و کارایی
            آشپزخانه‌تان را به‌روز کنید.
          </p>

          <div>
            <h3 className="text-base font-semibold">🔧 خدمات این پکیج:</h3>
            <ul className="list-disc space-y-1 pr-5">
              <li>تعمیر کابینت‌های آسیب‌دیده یا فرسوده</li>
              <li>تعویض یراق‌آلات قدیمی (لولا، ریل، جک و...)</li>
              <li>تعویض صفحه کابینت با مدل‌های متنوع</li>
              <li>مقاوم‌سازی پایه‌ها و اتصالات کابینت</li>
              <li>تعویض درب‌ها بدون تعویض بدنه</li>
              <li>ایجاد فضا برای نصب تجهیزات جدید</li>
            </ul>
          </div>

          <div>
            <h3 className="text-base font-semibold">✅ مزایا:</h3>
            <ul className="list-disc space-y-1 pr-5">
              <li>بدون تخریب یا بازسازی کامل</li>
              <li>اقتصادی‌تر از نصب کابینت نو</li>
              <li>مناسب برای خانه‌های اجاره‌ای یا کوچک</li>
              <li>اجرای سریع (کمتر از یک روز)</li>
              <li>سفارشی‌سازی خدمات</li>
              <li>اجرای تمیز توسط استادکار با‌تجربه</li>
            </ul>
          </div>

          <div>
            <h3 className="text-base font-semibold">👥 مناسب برای:</h3>
            <ul className="list-disc space-y-1 pr-5">
              <li>خانواده‌هایی با بودجه محدود</li>
              <li>افرادی که قصد اجاره یا فروش خانه دارند</li>
              <li>زوج‌های جوان و مستأجران</li>
              <li>مشتریان قدیمی ما</li>
            </ul>
          </div>

          <p>📍 مناطق تحت پوشش: کل استان تهران + شهرهای اطراف</p>

          <div>
            <h3 className="text-base font-semibold">📝 مراحل اجرا:</h3>
            <ol className="list-decimal space-y-1 pr-5">
              <li>بازدید حضوری</li>
              <li>ارائه پیش‌فاکتور</li>
              <li>قرارداد و ۵۰٪ پیش‌پرداخت</li>
              <li>تولید و اجرا (۱۰ تا ۱۵ روز)</li>
              <li>۲۵٪ حین اجرا</li>
              <li>۲۵٪ نهایی پس از تحویل</li>
            </ol>
          </div>

          <p>
            💬 <strong>هزینه بازدید:</strong> ۱۵۰ هزار تومان (در صورت قرارداد از
            فاکتور کسر می‌شود)
          </p>

          <div>
            <h3 className="text-base font-semibold">🎁 تخفیف‌های پلکانی:</h3>
            <ul className="list-disc space-y-1 pr-5">
              <li>بالای ۱۵ میلیون تومان: ۳٪</li>
              <li>بالای ۲۵ میلیون تومان: ۵٪</li>
              <li>بالای ۳۵ میلیون تومان: ۷٪ (تا سقف ۲ میلیون)</li>
            </ul>
          </div>

          <p className="mt-4">
            📞 برای رزرو بازدید، از طریق واتس‌اپ با ما در تماس باشید.
          </p>
        </div>
      </div>

      <div className="mt-6 flex justify-center">
        <Button
          variant="outline"
          onClick={() => setOpen((prev) => !prev)}
          className="rounded-full"
        >
          {open ? (
            <>
              بستن اطلاعات <ChevronUp className="mr-2 h-4 w-4" />
            </>
          ) : (
            <>
              اطلاعات بیشتر <ChevronDown className="mr-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </section>
  );
}
