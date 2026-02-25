import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { ProductWithRelations } from "@/types";

export function ProductReviewsSection({
  product,
}: {
  product: ProductWithRelations;
}) {
  return (
    <div className="mt-12 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>امتیاز و دیدگاه کاربران</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Rating summary */}
          <div className="flex items-center gap-3">
            <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
            <span className="text-xl font-bold">{product.rating}</span>
            <span className="text-muted-foreground">
              ({product.numReviews} نظر)
            </span>
          </div>

          <Separator />

          {/* Add comment */}
          <div className="space-y-3">
            <p className="font-medium">نظر خود را بنویسید</p>
            <Textarea placeholder="نظر شما درباره این محصول..." />
            <Button className="mt-4 w-fit rounded-full px-4 py-2">
              ثبت نظر
            </Button>
          </div>

          <Separator />

          {/* Empty state */}
          <p className="text-muted-foreground text-sm">
            هنوز نظری برای این محصول ثبت نشده است.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
