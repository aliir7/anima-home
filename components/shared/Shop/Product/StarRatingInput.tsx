"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils/utils";

type StarRatingInputProps = {
  value: number;
  onChange: (value: number) => void;
};

export default function StarRatingInput({
  value,
  onChange,
}: StarRatingInputProps) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex items-center gap-1" dir="ltr">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= (hovered || value);
        return (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            className="cursor-pointer p-0.5"
            aria-label={`امتیاز ${star} از ۵`}
          >
            <Star
              className={cn(
                "h-6 w-6 transition-colors",
                filled
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-muted-foreground",
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
