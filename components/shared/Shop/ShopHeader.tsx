"use client";

import { AlertTriangle, MessageCircleMore } from "lucide-react";
import Link from "next/link";

function ShopHeader() {
  return (
    <div className="bg-destructive/95 border-destructive/20 my-2 rounded-xl border p-3 text-neutral-50 shadow-sm sm:rounded-2xl sm:p-5">
      <div className="flex flex-col gap-3 sm:gap-4 md:flex-row md:items-center md:justify-between">
        {/* Content */}
        <div className="flex items-start gap-2.5 sm:gap-3">
          <div className="bg-background/15 flex h-9 w-9 shrink-0 items-center justify-center rounded-full sm:h-11 sm:w-11">
            <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>

          <div className="space-y-1">
            <h3 className="text-sm leading-6 font-bold sm:text-base md:text-lg">
              قیمت‌های سایت ممکن است به‌دلیل نوسانات بازار به‌روز نباشند.
            </h3>

            <p className="text-xs leading-5 opacity-90 sm:text-sm sm:leading-6">
              لطفاً پیش از ثبت سفارش برای استعلام قیمت نهایی با ما در ارتباط
              باشید.
            </p>
          </div>
        </div>

        {/* Contact */}
        <Link
          href="/contact"
          className="bg-background/10 hover:bg-background/20 inline-flex w-fit items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium backdrop-blur transition-colors sm:rounded-full sm:px-4 sm:text-sm"
        >
          <MessageCircleMore className="h-4 w-4 md:h-5 md:w-5" />
          <span>پشتیبانی از طریق واتساپ، تلگرام و بله</span>
        </Link>
      </div>
    </div>
  );
}

export default ShopHeader;
