"use client";

import { useState, useTransition } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import StarRatingInput from "./StarRatingInput";
import { createReview } from "@/lib/actions/review.actions";
import {
  showErrorToast,
  showSuccessToast,
} from "@/lib/utils/showToastMessage";

type ReviewFormProps = {
  productId: string;
  onSubmitted: () => void;
};

export default function ReviewForm({
  productId,
  onSubmitted,
}: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = () => {
    if (rating === 0) {
      showErrorToast("لطفا یک امتیاز انتخاب کنید", "top-right");
      return;
    }

    startTransition(async () => {
      const res = await createReview({ productId, rating, comment });

      if (!res.success) {
        const message =
          res.error.type === "custom"
            ? res.error.message
            : "خطایی رخ داد، ورودی را بررسی کنید";
        showErrorToast(message, "top-right");
        return;
      }

      showSuccessToast(res.data ?? "نظر شما ثبت شد", "top-right");
      setRating(0);
      setComment("");
      onSubmitted();
    });
  };

  return (
    <div className="space-y-3">
      <p className="font-medium">نظر خود را بنویسید</p>

      <StarRatingInput value={rating} onChange={setRating} />

      <Textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="نظر شما درباره این محصول... (اختیاری)"
        maxLength={1000}
      />

      <Button
        onClick={handleSubmit}
        disabled={isPending}
        className="mt-2 w-fit rounded-full px-4 py-2"
      >
        {isPending && <Spinner width={4} height={4} className="ml-2" />}
        ثبت نظر
      </Button>
    </div>
  );
}
