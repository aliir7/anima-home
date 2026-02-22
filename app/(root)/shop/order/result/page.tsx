import OrderFailed from "@/components/shared/Shop/Checkout/OrderFailed";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Row from "@/components/ui/Row";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge"; // ✅ ایمپورت صحیح بجای lucide-react
import { getOrderById } from "@/lib/actions/order.actions";
import { verifyPayment } from "@/lib/actions/payment.actions";
import formatPrice from "@/lib/utils/formatPrice";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "وضعیت پرداخت",
};

type OrderResultPageProps = {
  searchParams: Promise<{
    orderId?: string;
    trackId?: string;
    success?: string; // زیبال "1" موفق یا "0" ناموفق برمی‌گرداند
    status?: string; // وضعیت عددی درگاه
  }>;
};

export default async function OrderResultPage({
  searchParams,
}: OrderResultPageProps) {
  const { orderId, trackId, success } = await searchParams;

  // ۱. اگر پارامترهای اساسی نبودند، صفحه یافت نشد نشان بده
  if (!orderId || !trackId) {
    notFound();
  }

  // ۲. دریافت اطلاعات سفارش
  const order = await getOrderById(orderId);
  if (!order) notFound();

  // ۳. بررسی انصراف یا خطای کاربر در درگاه (قبل از ارسال درخواست تایید به زیبال)
  // ✅ اصلاح شد: فقط success نامساوی "1" را چک می‌کنیم. نیازی به بررسی status نیست.
  if (success !== "1") {
    return (
      <OrderFailed
        orderId={orderId}
        reason="پرداخت توسط شما لغو شد یا موجودی حساب کافی نبود."
      />
    );
  }

  // ۴. 🔴 مرحله حیاتی: تایید پرداخت در سرور (Verify) 🔴
  const verificationResult = await verifyPayment(trackId, orderId);

  // ۵. اگر تایید پرداخت در سمت سرور زیبال شکست خورد
  if (!verificationResult.success) {
    return (
      <OrderFailed
        orderId={orderId}
        reason={
          verificationResult.message ||
          "تایید نهایی پرداخت از سمت بانک با خطا مواجه شد. در صورت کسر وجه، مبلغ طی ۷۲ ساعت به حساب شما بازخواهد گشت."
        }
      />
    );
  }

  // ۶. ✅ پرداخت صد در صد موفق بوده و دیتابیس هم آپدیت شده است
  return (
    <div className="wrapper max-w-2xl py-12">
      <Card>
        <CardHeader className="space-y-4 text-center">
          <CheckCircle2 className="mx-auto h-16 w-16 text-green-600" />
          <CardTitle className="text-2xl text-green-600">
            پرداخت با موفقیت انجام شد
          </CardTitle>
          <div className="flex justify-center rounded-full">
            <Badge className="rounded-full bg-green-600 py-2 hover:bg-green-700">
              پرداخت آنلاین تایید شد
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="rounded-full border border-green-100 bg-green-50/50 p-4 text-center text-sm leading-7 text-green-800">
            پرداخت شما با موفقیت تایید شد و سفارش در صف پردازش قرار گرفت. از
            خرید شما سپاسگزاریم.
          </div>

          <Separator />

          <div className="space-y-4 text-sm">
            <Row label="شماره سفارش" value={order.id} />
            <Row
              label="مبلغ پرداخت‌شده"
              value={`${formatPrice(order.totalPrice)}`}
            />
            <Row label="شماره پیگیری درگاه" value={trackId} />
            <Row label="وضعیت سفارش" value="در حال پردازش" />
          </div>

          <Separator />

          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <Button className="w-full rounded-full px-3 py-2" asChild>
              <Link href={`/my-account/orders/order/${order.id}`}>
                مشاهده فاکتور سفارش
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
