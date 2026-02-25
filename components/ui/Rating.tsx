"use client";

import { BsStar, BsStarFill, BsStarHalf } from "react-icons/bs";
import { cn } from "@/lib/utils/utils"; // اگر از ترکیب کلاس‌ها استفاده می‌کنید

type RatingProps = {
  rate: number; // 0 تا 5
  size?: number;
  color?: string;
  className?: string;
};

export default function Rating({
  rate,
  size = 18,
  color = "#f0b100",
  className,
}: RatingProps) {
  const stars = Array.from({ length: 5 }, (_, i) => {
    const val = i + 1;
    if (rate >= val) return "full";
    if (rate >= val - 0.5) return "half";
    return "empty";
  });

  return (
    <div className={cn("flex items-center gap-1 rtl:flex-row", className)}>
      {stars.map((type, idx) => {
        if (type === "full")
          return <BsStarFill key={idx} size={size} color={color} />;
        if (type === "half")
          return <BsStarHalf key={idx} size={size} color={color} />;
        return <BsStar key={idx} size={size} color={color} />;
      })}
    </div>
  );
}
