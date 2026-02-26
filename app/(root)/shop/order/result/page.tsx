import OrderFailed from "@/components/shared/Shop/Checkout/OrderFailed";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Row from "@/components/ui/Row";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { getOrderById } from "@/lib/actions/order.actions";
import { verifyPayment } from "@/lib/actions/payment.actions";
import formatPrice from "@/lib/utils/formatPrice";
import { CheckCircle2, CreditCard } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { PAYMENT_METHOD } from "@/lib/constants";
import CopyableCardNumber from "@/components/shared/Shop/Order/CopyableCardNumber";

export const metadata: Metadata = {
  title: "وضعیت پرداخت",
};

type OrderResultPageProps = {
  searchParams: Promise<{
    orderId?: string;
    trackId?: string;
    success?: string;
    status?: string;
    method?: string;
  }>;
};

export default async function OrderResultPage({
  searchParams,
}: OrderResultPageProps) {
  // در Next.js 15 باید searchParams را await کنیم
  const { orderId, trackId, success, method } = await searchParams;

  // ۱. اگر شماره سفارش نباشد، صفحه پیدا نمی‌شود
  if (!orderId) {
    notFound();
  }

  // ۲. دریافت اطلاعات سفارش از دیتابیس
  const order = await getOrderById(orderId);
  if (!order) notFound();

  // ============================================================
  // سناریوی الف: روش پرداخت کارت به کارت (Card to Card)
  // ============================================================
  // اگر متد در URL برابر cardToCard بود یا در دیتابیس روی حالت CARD ثبت شده بود
  if (method === "cardToCard" || order.paymentMethod === PAYMENT_METHOD.CARD) {
    return (
      <div className="wrapper max-w-2xl py-12">
        <Card className="dark:bg-background border-green-200 bg-green-50/30">
          <CardHeader className="space-y-4 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CreditCard className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-700">
              سفارش ثبت شد، منتظر پرداخت
            </CardTitle>
            <div className="flex justify-center rounded-full">
              <Badge className="rounded-full bg-green-600 px-4 py-2 text-white hover:bg-green-700">
                روش پرداخت: کارت به کارت
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="rounded-xl border border-green-100 bg-white p-6 text-center shadow-sm">
              <p className="mb-2 text-sm text-neutral-500">
                لطفاً مبلغ سفارش را به شماره کارت زیر واریز نمایید:
              </p>

              <CopyableCardNumber
                className="mb-4"
                cardNumber="۳۴۳۰  ۱۹۵۱  ۷۲۱۲  ۵۰۴۱" // نمایشی (با فونت فارسی و فاصله)
                rawValue="5041721219513430" // مقداری که در کلیپ‌بورد کپی می‌شود (انگلیسی بدون فاصله)
              />

              <div className="flex justify-between px-4 text-sm text-neutral-600">
                <span>
                  به نام: <strong>امید رضایی نصرت</strong>
                </span>
                <span>
                  بانک: <strong>رسالت</strong>
                </span>
              </div>
            </div>

            <Separator className="bg-green-100" />

            <div className="space-y-4 text-sm">
              <Row
                label="کد رهگیری سفارش"
                value={order.refNumber ?? order.id}
              />
              <Row
                label="مبلغ قابل پرداخت"
                value={formatPrice(order.totalPrice)}
              />
              <Row label="وضعیت فعلی" value="در انتظار واریز وجه" />
            </div>

            <Separator className="bg-green-100" />

            <div className="flex flex-col gap-3 pt-2">
              <p className="text-center text-xs text-neutral-500 dark:text-neutral-300">
                پس از واریز، تصویر رسید را در واتساپ ارسال کنید تا سفارش پردازش
                شود.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  className="w-full rounded-full bg-green-600 text-white hover:bg-green-700"
                  asChild
                >
                  <Link
                    href={`https://wa.me/989129277302?text=سلام، رسید پرداخت سفارش شماره ${order.refNumber} را ارسال می‌کنم.`}
                    target="_blank"
                  >
                    ارسال رسید در واتساپ
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ============================================================
  // سناریوی ب: روش پرداخت آنلاین (Online - Zibal)
  // ============================================================

  // ۳. بررسی trackId برای پرداخت آنلاین
  if (!trackId) {
    notFound();
  }

  // ۴. بررسی موفقیت اولیه (پارامتر url)
  if (success !== "1") {
    return (
      <OrderFailed
        orderId={orderId}
        reason="پرداخت توسط شما لغو شد یا با خطا مواجه گردید."
      />
    );
  }

  // ۵. تایید نهایی پرداخت (Verify) در سمت سرور
  const verificationResult = await verifyPayment(trackId, orderId);

  if (!verificationResult.success) {
    return (
      <OrderFailed
        orderId={orderId}
        reason={
          verificationResult.message ||
          "تایید نهایی پرداخت از سمت بانک با خطا مواجه شد."
        }
      />
    );
  }

  // ۶. نمایش موفقیت پرداخت آنلاین
  return (
    <div className="wrapper max-w-2xl py-12">
      <Card className="dark:bg-neutralDark border-green-200 bg-green-50/30">
        <CardHeader className="space-y-4 text-center">
          <CheckCircle2 className="mx-auto h-16 w-16 text-green-600" />
          <CardTitle className="text-2xl text-green-600">
            پرداخت با موفقیت انجام شد
          </CardTitle>
          <div className="flex justify-center rounded-full">
            <Badge className="rounded-full bg-green-600 py-2 text-white hover:bg-green-700">
              پرداخت آنلاین تایید شد
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="rounded-full border border-green-100 bg-white p-4 text-center text-sm leading-7 text-green-800 shadow-sm dark:bg-neutral-50">
            پرداخت شما با موفقیت تایید شد و سفارش در صف پردازش قرار گرفت. از
            خرید شما سپاسگزاریم.
          </div>

          <Separator className="bg-green-100" />

          <div className="space-y-4 text-sm">
            <Row label="شماره سفارش" value={order.refNumber ?? order.id} />
            <Row
              label="مبلغ پرداخت‌شده"
              value={`${formatPrice(order.totalPrice)}`}
            />
            <Row label="شماره پیگیری درگاه" value={trackId} />
            <Row label="وضعیت سفارش" value="در حال پردازش" />
          </div>

          <Separator className="bg-green-100" />

          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <Button
              className="w-full rounded-full bg-green-600 text-white hover:bg-green-700"
              asChild
            >
              <Link href={`/my-account/orders`}>مشاهده سفارشات من</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
