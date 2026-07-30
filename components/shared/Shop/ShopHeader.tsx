"use client";

import { AlertTriangle, MessageCircleMore } from "lucide-react";
import Link from "next/link";

function ShopHeader() {
  return (
    <div className="bg-primary/90 border-primary/20 mt-2 mb-4 rounded-xl border p-3 text-neutral-50 shadow-sm md:rounded-2xl md:p-4 dark:border-neutral-700/20 dark:bg-neutral-700">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        {/* Content */}
        <div className="flex items-start gap-2.5">
          <div className="bg-background/15 flex h-8 w-8 shrink-0 items-center justify-center rounded-full md:h-10 md:w-10">
            <AlertTriangle className="h-4 w-4 md:h-5 md:w-5" />
          </div>

          <div className="space-y-0.5">
            <h3 className="text-xs font-semibold md:text-sm">
              اطلاعیه قیمت محصولات
            </h3>

            <p className="text-[11px] leading-5 opacity-90 md:text-xs md:leading-6">
              با توجه به نوسانات لحظه‌ای بازار، لطفاً پیش از نهایی کردن خرید،
              برای اطلاع از قیمت نهایی با کارشناسان آنیما هوم در ارتباط باشید.
            </p>
          </div>
        </div>

        {/* Contact */}
        <Link
          href="/contact"
          className="bg-background/10 hover:bg-background/20 inline-flex w-fit items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium backdrop-blur transition-colors md:rounded-full md:px-4"
        >
          <MessageCircleMore className="h-4 w-4" />
          <span>ارتباط با کارشناسان</span>
        </Link>
      </div>
    </div>
  );
}

export default ShopHeader;
