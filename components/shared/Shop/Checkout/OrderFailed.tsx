import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

function OrderFailed({ orderId }: { orderId: string }) {
  return (
    <div className="wrapper max-w-2xl py-10">
      <Card>
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-red-600">پرداخت ناموفق ❌</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="rounded-md bg-red-50 p-4 text-sm leading-7 text-red-700">
            پرداخت انجام نشد یا توسط کاربر لغو شد. در صورت کسر وجه، مبلغ حداکثر
            تا ۷۲ ساعت بازگشت داده می‌شود.
          </div>

          <div className="flex flex-col gap-3">
            <Button asChild>
              <Link href={`/shop/checkout/payment`}>تلاش مجدد برای پرداخت</Link>
            </Button>

            <Button variant="outline" asChild>
              <Link href={`/order/${orderId}`}>مشاهده سفارش</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default OrderFailed;
