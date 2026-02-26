"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils/utils";
import { showErrorToast, showSuccessToast } from "@/lib/utils/showToastMessage";

interface CopyableCardNumberProps {
  cardNumber: string; // شماره کارت با ارقام فارسی یا انگلیسی برای نمایش
  rawValue: string; // شماره کارت خالص (بدون فاصله و انگلیسی) برای کپی شدن
  className?: string;
}

export default function CopyableCardNumber({
  cardNumber,
  rawValue,
  className,
}: CopyableCardNumberProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(rawValue);
      setCopied(true);
      showSuccessToast("شماره کارت کپی شد", "top-center");
      setTimeout(() => setCopied(false), 2000); // بعد از ۲ ثانیه وضعیت را برگردان
    } catch (err) {
      console.error("Failed to copy!", err);
      showErrorToast("خطا در کپی رخ داد", "top-center");
    }
  };

  return (
    <div
      className={cn(
        "dark:bg-accent-foreground flex items-center justify-center gap-3 rounded-full border border-dashed border-neutral-300 bg-neutral-50 px-4 py-3",
        className,
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={handleCopy}
        className="h-4 w-4 text-neutral-500 hover:bg-green-50 hover:text-green-600 md:h-8 md:w-8"
        title="کپی شماره کارت"
      >
        {copied ? (
          <Check className="h-2 w-2 text-green-600 md:h-4 md:w-4" />
        ) : (
          <Copy className="h-2 w-2 md:h-4 md:w-4" />
        )}
      </Button>
      <span className="dir-ltr font-mono text-sm font-bold tracking-widest text-neutral-800 md:text-xl">
        {cardNumber}
      </span>
    </div>
  );
}
