import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import formatPrice from "@/lib/utils/formatPrice";
import { Cart } from "@/types";
import { Truck } from "lucide-react";
import Link from "next/link";

type CartSummaryProps = {
  cart: Cart;
};

function CartSummary({ cart }: CartSummaryProps) {
  return (
    <Card className="sticky top-24">
      <CardContent className="space-y-4 p-4">
        <h3 className="text-sm font-semibold">خلاصه سفارش</h3>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">
              قیمت کالاها ({cart.items.length})
            </span>
            <span>{formatPrice(cart.itemsPrice)}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">مالیات</span>
            <span>{formatPrice(cart.taxPrice)}</span>
          </div>

          <div className="text-muted-foreground mt-4 mb-6 flex justify-between text-xs">
            <span className="flex items-center gap-1">
              <Truck className="h-4 w-4" />
              هزینه ارسال
            </span>
            <span>به عهده مشتری (تیپاکس)</span>
          </div>
        </div>

        <Separator />

        <div className="flex justify-between text-base font-bold">
          <span>مبلغ قابل پرداخت</span>
          <span>{formatPrice(cart.totalPrice)}</span>
        </div>

        <Button className="w-full rounded-full" asChild size="lg">
          <Link href="/shop/checkout">ادامه فرآیند خرید</Link>
        </Button>

        <p className="text-muted-foreground text-xs leading-relaxed">
          هزینه ارسال در مرحله بعد و بر اساس آدرس مقصد توسط
          <span className="font-medium"> تیپاکس </span>
          محاسبه خواهد شد.
        </p>
      </CardContent>
    </Card>
  );
}

export default CartSummary;
