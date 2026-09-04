"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { format } from "date-fns-jalali";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import ReviewForm from "./ReviewForm";
import Rating from "@/components/ui/Rating";
import { getProductReviews } from "@/lib/actions/review.actions";
import { ProductWithRelations, ReviewWithUser } from "@/types";

type ReviewEligibility = {
  canReview: boolean;
  reason?: "NOT_LOGGED_IN" | "NOT_PURCHASED" | "ALREADY_REVIEWED";
};

type ProductReviewsSectionProps = {
  product: ProductWithRelations;
  initialReviews: ReviewWithUser[];
  initialHasMore: boolean;
  eligibility: ReviewEligibility;
};

export function ProductReviewsSection({
  product,
  initialReviews,
  initialHasMore,
  eligibility,
}: ProductReviewsSectionProps) {
  const [reviewsList, setReviewsList] =
    useState<ReviewWithUser[]>(initialReviews);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [canReview, setCanReview] = useState(eligibility.canReview);
  const [showForm, setShowForm] = useState(false);

  const handleLoadMore = async () => {
    setIsLoadingMore(true);
    const nextPage = page + 1;
    const res = await getProductReviews(product.id, nextPage);

    if (res.success && res.data) {
      setReviewsList((prev) => [...prev, ...res.data!.reviews]);
      setHasMore(res.data.hasMore);
      setPage(nextPage);
    }
    setIsLoadingMore(false);
  };

  const handleSubmitted = () => {
    // بعد از ثبت نظر جدید، اجازه‌ی نظر دوباره نداریم و لیست را از اول می‌خوانیم
    setCanReview(false);
    setShowForm(false);
    getProductReviews(product.id, 1).then((res) => {
      if (res.success && res.data) {
        setReviewsList(res.data.reviews);
        setHasMore(res.data.hasMore);
        setPage(1);
      }
    });
  };

  const eligibilityMessage: Record<
    NonNullable<ReviewEligibility["reason"]>,
    string
  > = {
    NOT_LOGGED_IN: "برای ثبت نظر ابتدا وارد حساب کاربری خود شوید.",
    NOT_PURCHASED: "فقط خریداران این محصول می‌توانند برای آن نظر ثبت کنند.",
    ALREADY_REVIEWED: "شما قبلاً برای این محصول نظر ثبت کرده‌اید.",
  };

  return (
    <div className="mt-12 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>امتیاز و دیدگاه کاربران</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Rating summary */}
          <div className="flex items-center gap-3">
            <Rating rate={Number(product.rating)} size={22} />
            <span className="text-xl font-bold">{product.rating}</span>
            <span className="text-muted-foreground">
              ({product.numReviews} نظر)
            </span>
          </div>

          <Separator />

          {/* Add comment */}
          {canReview ? (
            showForm ? (
              <ReviewForm
                productId={product.id}
                onSubmitted={handleSubmitted}
              />
            ) : (
              <Button
                variant="outline"
                className="rounded-full"
                onClick={() => setShowForm(true)}
              >
                ثبت نظر برای این محصول
              </Button>
            )
          ) : (
            eligibility.reason && (
              <p className="text-muted-foreground text-sm">
                {eligibilityMessage[eligibility.reason]}
              </p>
            )
          )}

          <Separator />

          {/* Reviews list */}
          {reviewsList.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              هنوز نظری برای این محصول ثبت نشده است.
            </p>
          ) : (
            <div className="space-y-5">
              {reviewsList.map((review) => (
                <div key={review.id} className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium">
                      {review.user.name || "کاربر آنیماهوم"}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      {format(review.createdAt, "yyyy/MM/dd")}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        className={
                          i < review.rating
                            ? "h-3.5 w-3.5 fill-yellow-400 text-yellow-400"
                            : "text-muted-foreground h-3.5 w-3.5"
                        }
                      />
                    ))}
                  </div>
                  {review.comment && (
                    <p className="text-sm leading-6">{review.comment}</p>
                  )}
                </div>
              ))}

              {hasMore && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  className="w-full rounded-full"
                >
                  {isLoadingMore ? "در حال بارگذاری..." : "نمایش نظرات بیشتر"}
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
