import RetryPaymentButton from "@/components/shared/Shop/Order/RetryPaymentButton";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getOrderById } from "@/lib/actions/order.actions";
import { auth } from "@/lib/auth";
import formatPrice from "@/lib/utils/formatPrice";
import { CalendarDays, MapPin, Phone, Receipt, User } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { format } from "date-fns-jalali";
import { ShippingAddress } from "@/types";

export const metadata: Metadata = {
  title: "جزئیات سفارش",
};

export default async function UserOrderDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // ۲. بررسی احراز هویت
  const session = await auth();
  if (!session?.user) {
    redirect("/sign-in");
  }

  // ۳. دریافت اطلاعات سفارش به همراه آیتم‌ها
  const order = await getOrderById(id);

  // اگر سفارش نبود، یا متعلق به کاربر نبود
  if (!order || order.userId !== session.user.id) {
    notFound();
  }

  const isPaid = order.isPaid;
  // بررسی روش پرداخت (ممکن است در دیتابیس شما حروف کوچک/بزرگ متفاوت باشد)
  const isOnlinePayment =
    order.paymentMethod === "ONLINE" || order.paymentMethod === "درگاه پرداخت";
  const shippingAddress = order.shippingAddress as ShippingAddress | null;

  return (
    <div className="wrapper space-y-8 py-12">
      {/* هدر صفحه */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="flex items-center gap-2 text-2xl font-bold">
            <Receipt className="text-primary h-6 w-6 dark:text-neutral-500" />
            جزئیات سفارش
          </h2>
          <p className="text-muted-foreground mt-2 text-sm dark:text-neutral-500">
            کد پیگیری سفارش: {order.id}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isPaid ? (
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

          {/* وضعیت کلی ارسال */}
          <Badge
            variant="outline"
            className="outline-primary rounded-full px-3 py-1 text-sm outline-1 dark:text-neutral-700 dark:outline-1 dark:outline-neutral-600"
          >
            {/* فرض بر این است که فیلد isDelivered دارید */}
            {order.isDelivered ? "تحویل داده شده" : "در حال پردازش"}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* ستون راست: اطلاعات سفارش و آدرس */}
        <div className="space-y-6 lg:col-span-2">
          {/* بخش آدرس و اطلاعات کاربر */}
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

          {/* لیست محصولات سفارش داده شده */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">محصولات سفارش</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="divide-y">
                {order.items?.map((item: any) => (
                  <div
                    key={item.id || item.productId}
                    className="flex items-center gap-4 py-4"
                  >
                    {/* تصویر محصول */}
                    <div className="bg-muted relative h-16 w-16 shrink-0 overflow-hidden rounded-md border">
                      <Image
                        // استفاده از ?. برای جلوگیری از کرش کردن در صورت نبود عکس
                        src={
                          item.product?.images?.[0] ||
                          item.image ||
                          "/placeholder.jpg"
                        }
                        alt={item.product?.name || item.name || "محصول"}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* اطلاعات محصول */}
                    <div className="flex-1 space-y-1">
                      <h4 className="line-clamp-1 text-sm font-medium sm:text-base">
                        {item.product?.name || item.name}
                      </h4>
                      {item.variant && (
                        <p className="text-muted-foreground text-xs">
                          {/* نمایش ویژگی‌ها */}
                          تنوع:{" "}
                          {item.variant?.name ||
                            item.variant?.color ||
                            item.variant?.title}
                        </p>
                      )}
                      <p className="text-sm font-semibold">
                        {formatPrice(item.price)}
                      </p>
                    </div>

                    {/* تعداد */}
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

        {/* ستون چپ: خلاصه فاکتور و پرداخت */}
        <div className="space-y-6">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="text-lg">خلاصه فاکتور</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-muted-foreground flex items-center gap-2 text-sm">
                <CalendarDays className="h-4 w-4" />
                {/* استفاده از date-fns-jalali برای فرمت تاریخ */}
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
                  <span>{formatPrice(order.itemsPrice)} </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    مالیات بر ارزش افزوده:
                  </span>
                  <span>{formatPrice(order.taxPrice)} </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">هزینه ارسال:</span>
                  <span>پس کرایه (پرداخت در محل)</span>
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between text-lg font-bold">
                <span>مبلغ قابل پرداخت:</span>
                <span className="text-primary">
                  {formatPrice(order.totalPrice)}
                </span>
              </div>

              {/* دکمه پرداخت در صورت نیاز */}
              {!isPaid && isOnlinePayment && (
                <div className="mt-4 flex flex-col gap-3 border-t pt-4">
                  <div className="mb-2 rounded-md border border-yellow-200 bg-yellow-50 p-3 text-center text-sm leading-relaxed text-yellow-800">
                    پرداخت این سفارش انجام نشده است. جهت نهایی شدن، لطفاً پرداخت
                    را انجام دهید.
                  </div>
                  <RetryPaymentButton
                    orderId={order.id}
                    amount={order.totalPrice}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
