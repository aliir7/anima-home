import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { AlertTriangle } from "lucide-react"; // اضافه کردن یک آیکون برای زیبایی (اختیاری)

// اضافه کردن reason به تایپ‌ها
type OrderFailedProps = {
  orderId: string;
  reason?: string;
};

function OrderFailed({ orderId, reason }: OrderFailedProps) {
  return (
    <div className="wrapper max-w-2xl py-12">
      <Card className="border-red-200">
        <CardHeader className="space-y-2 text-center">
          <AlertTriangle className="mx-auto mb-2 h-12 w-12 text-red-500" />
          <CardTitle className="text-red-600">پرداخت ناموفق ❌</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex flex-col gap-2 rounded-md bg-red-50 p-4 text-sm leading-7 text-red-700">
            {/* نمایش دلیل خطا در صورت وجود */}
            {reason && (
              <p>
                <strong>علت خطا: </strong> {reason}
              </p>
            )}

            <p>
              پرداخت شما انجام نشد یا فرآیند توسط خودتان لغو گردید. در صورتی که
              وجهی از حساب شما کسر شده است، مبلغ طی حداکثر ۷۲ ساعت آینده توسط
              بانک به حساب شما بازگشت داده خواهد شد.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {/* 
              نکته منطقی: 
              کاربر باید به صفحه خود سفارش برود و از آنجا دوباره پرداخت کند.
              نباید به مسیر checkout برگردد چون سفارش از قبل ساخته شده است.
            */}
            <Button
              asChild
              className="rounded-full bg-red-600 transition hover:bg-red-700 dark:text-neutral-50"
            >
              <Link href={`/my-account/orders/order/${orderId}`}>
                مشاهده سفارش و پرداخت مجدد
              </Link>
            </Button>

            <Button
              variant="outline"
              asChild
              className="rounded-full transition"
            >
              <Link href="/shop">بازگشت به فروشگاه</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default OrderFailed;
