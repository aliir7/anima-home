import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { format } from "date-fns-jalali";
import { CalendarDays, Mail, MapPin, Phone, Receipt, User } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import OrderStatusActions from "@/components/shared/Admin/Orders/OrderStatusActions";

import { getOrderById } from "@/lib/services/order.service";
import { requireAdmin } from "@/lib/auth/authGuard";
import { PAYMENT_METHOD, PAYMENT_METHOD_LABEL } from "@/lib/constants";
import formatPrice from "@/lib/utils/formatPrice";
import { ShippingAddress } from "@/types";
import { getSafeImageSrc, getStorageUrl } from "@/lib/utils/urlUtils";

export default async function AdminDetailsOrder({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await requireAdmin();

  // getOrderById خودش هیچ چک مالکیتی ندارد (طبق طراحی عمدی‌اش) — چون این
  // صفحه از قبل پشت requireAdmin() است، همینجا مجاز است هر سفارشی را ببیند
  const order = await getOrderById(id);

  if (!order) {
    notFound();
  }

  const shippingAddress = order.shippingAddress as ShippingAddress | null;
  const isOnlinePayment = order.paymentMethod === PAYMENT_METHOD.ONLINE;
  const paymentMethodLabel = order.paymentMethod
    ? (PAYMENT_METHOD_LABEL[
        order.paymentMethod as keyof typeof PAYMENT_METHOD_LABEL
      ] ?? order.paymentMethod)
    : "نامشخص";

  return (
    <div className="space-y-8 py-6">
      {/* هدر صفحه */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <Link
            href="/admin/orders"
            className="text-muted-foreground mb-2 inline-block text-sm hover:underline"
          >
            ← بازگشت به لیست سفارش‌ها
          </Link>
          <h2 className="flex items-center gap-2 text-2xl font-bold">
            <Receipt className="text-primary h-6 w-6 dark:text-neutral-500" />
            جزئیات سفارش
          </h2>
          <p className="text-muted-foreground mt-2 text-sm dark:text-neutral-500">
            کد پیگیری سفارش: {order.refNumber}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {order.isPaid ? (
            <Badge className="rounded-full bg-green-600 px-3 py-1 text-sm text-white">
              پرداخت شده
            </Badge>
          ) : (
            <Badge
              variant="destructive"
              className="rounded-full px-3 py-1 text-sm"
            >
              در انتظار پرداخت
            </Badge>
          )}

          <Badge
            variant="outline"
            className="outline-primary rounded-full px-3 py-1 text-sm outline-1 dark:text-neutral-700 dark:outline-1 dark:outline-neutral-600"
          >
            {order.isDelivered ? "تحویل داده شده" : "در حال پردازش"}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* ستون راست: اطلاعات خریدار، آدرس، محصولات */}
        <div className="space-y-6 lg:col-span-2">
          {/* اطلاعات خریدار — فقط ادمین این را می‌بیند */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">اطلاعات خریدار</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-relaxed">
              <div className="flex items-start gap-2">
                <User className="text-muted-foreground mt-1 h-4 w-4 shrink-0" />
                <span>{order.user?.name ?? "کاربر مهمان"}</span>
              </div>
              {order.user?.email && (
                <div className="flex items-start gap-2">
                  <Mail className="text-muted-foreground mt-1 h-4 w-4 shrink-0" />
                  <span dir="ltr" className="w-full text-right">
                    {order.user.email}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* آدرس ارسال */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">اطلاعات ارسال</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-relaxed">
              <div className="flex items-start gap-2">
                <User className="text-muted-foreground mt-1 h-4 w-4 shrink-0" />
                <span>تحویل گیرنده: {shippingAddress?.fullName}</span>
              </div>
              <div className="flex items-start gap-2">
                <Phone className="text-muted-foreground mt-1 h-4 w-4 shrink-0" />
                <span dir="ltr" className="w-full text-right font-medium">
                  {shippingAddress?.phone}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="text-muted-foreground mt-1 h-4 w-4 shrink-0" />
                <span>
                  {shippingAddress?.city}، {shippingAddress?.streetAddress}
                  <br />
                  <span className="text-muted-foreground mt-1 block text-xs">
                    کد پستی: {shippingAddress?.postalCode}
                  </span>
                </span>
              </div>
            </CardContent>
          </Card>

          {/* محصولات سفارش */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">محصولات سفارش</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="divide-y">
                {order.items.map((item) => (
                  <div
                    key={`${item.productId}-${item.variantId ?? "default"}`}
                    className="flex items-center gap-4 py-4"
                  >
                    <div className="bg-muted relative h-16 w-16 shrink-0 overflow-hidden rounded-md border">
                      <Image
                        src={getStorageUrl(item.image) || "/placeholder.jpg"}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 space-y-1">
                      <h4 className="line-clamp-1 text-sm font-medium sm:text-base">
                        {item.name}
                      </h4>
                      <p className="text-sm font-semibold">
                        {formatPrice(item.price)}
                      </p>
                    </div>

                    <div className="bg-muted rounded-md px-4 py-1 text-center">
                      <span className="text-muted-foreground block text-[10px] sm:text-xs">
                        تعداد
                      </span>
                      <span className="text-sm font-bold sm:text-base">
                        {item.qty}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ستون چپ: خلاصه فاکتور + اقدامات ادمین */}
        <div className="space-y-6">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="text-lg">خلاصه فاکتور</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-muted-foreground flex items-center gap-2 text-sm">
                <CalendarDays className="h-4 w-4" />
                <span>
                  ثبت شده در:{" "}
                  {format(new Date(order.createdAt), "yyyy/MM/dd HH:mm")}
                </span>
              </div>

              <Separator />

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    مبلغ کل محصولات:
                  </span>
                  <span>{formatPrice(order.itemsPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    مالیات بر ارزش افزوده:
                  </span>
                  <span>{formatPrice(order.taxPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">روش پرداخت:</span>
                  <span>{paymentMethodLabel}</span>
                </div>
                {order.isPaid && order.paidAt && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">تاریخ پرداخت:</span>
                    <span>{format(order.paidAt, "yyyy/MM/dd HH:mm")}</span>
                  </div>
                )}
                {order.isDelivered && order.deliveredAt && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">تاریخ تحویل:</span>
                    <span>{format(order.deliveredAt, "yyyy/MM/dd HH:mm")}</span>
                  </div>
                )}
              </div>

              <Separator />

              <div className="flex items-center justify-between text-lg font-bold">
                <span>مبلغ کل سفارش:</span>
                <span className="text-primary">
                  {formatPrice(order.totalPrice)}
                </span>
              </div>

              <OrderStatusActions
                orderId={order.id}
                isPaid={!!order.isPaid}
                isDelivered={!!order.isDelivered}
                isOnlinePayment={isOnlinePayment}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
