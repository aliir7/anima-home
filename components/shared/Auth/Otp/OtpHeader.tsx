"use client";

import { ArrowRight, Smartphone } from "lucide-react";

import { Button } from "@/components/ui/button";

type Props = {
  mobile: string;
  onEdit: () => void;
};

export default function OtpHeader({ mobile, onEdit }: Props) {
  return (
    <div className="space-y-4 text-center">
      <div className="bg-muted inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm">
        <Smartphone className="text-primary h-4 w-4" />

        <span className="text-muted-foreground">کد تایید ارسال شد به</span>

        <span className="font-semibold tracking-wide">{mobile}</span>
      </div>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onEdit}
        className="text-primary hover:text-primary h-auto gap-1 rounded-full px-3"
      >
        <ArrowRight className="h-4 w-4" />
        ویرایش شماره موبایل
      </Button>
    </div>
  );
}
