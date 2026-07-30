"use client";

import { RotateCcw, Timer } from "lucide-react";

import { Button } from "@/components/ui/button";

type Props = {
  timer: number;
  isPending: boolean;
  formatTime: (time: number) => string;
  onResend: () => void;
};

export default function OtpTimer({
  timer,
  isPending,
  formatTime,
  onResend,
}: Props) {
  if (timer > 0) {
    return (
      <div className="flex justify-center">
        <div className="bg-muted text-muted-foreground inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm">
          <Timer className="h-4 w-4" />

          <span>ارسال مجدد تا</span>

          <span className="text-primary font-semibold tabular-nums">
            {formatTime(timer)}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        disabled={isPending}
        onClick={onResend}
        className="text-primary hover:text-primary gap-2 rounded-full"
      >
        <RotateCcw className="h-4 w-4" />
        ارسال مجدد کد
      </Button>
    </div>
  );
}
