import CheckoutSteps from "@/components/shared/Shop/Checkout/CheckoutSteps";
import PlaceOrderForm from "@/components/shared/Shop/Checkout/PlaceOrderForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getMyCart } from "@/lib/actions/cart.actions";
import { getUserById } from "@/lib/actions/user.actions";
import { auth } from "@/lib/auth";
import formatPrice from "@/lib/utils/formatPrice";
import { CartItem, ShippingAddress } from "@/types";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "ثبت نهایی سفارش",
};

async function PlaceOrderPage() {
  const cart = await getMyCart();
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) throw new Error("User not found");

  const user = await getUserById(userId);

  if (!cart || (cart.items as CartItem[]).length === 0) redirect("/shop/cart");
  if (!user.address) redirect("/shop/checkout/shipping-address");
  if (!user.paymentMethod) redirect("/shop/checkout/payment-method");

  const userAddress = user.address as ShippingAddress;

  return (
    // تغییر 1: ریسپانسیو کردن پدینگ‌ها برای جلوگیری از هدر رفتن فضا در موبایل و جلوگیری از اسکرول افقی کل صفحه
    <section className="wrapper w-full max-w-full overflow-hidden px-3 py-8 md:px-6 md:py-12">
      <CheckoutSteps current={3} />

      <h2 className="text-primary py-4 text-xl font-semibold md:text-2xl dark:text-neutral-950">
        بررسی نهایی و ثبت سفارش
      </h2>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {/* LEFT */}
        <div className="w-full max-w-full space-y-5 md:col-span-2">
          {/* Address */}
          <Card className="w-full">
            <CardContent className="space-y-2 px-4 py-4 md:px-6">
              <h3 className="text-base font-semibold md:text-lg">آدرس ارسال</h3>
              <Separator className="bg-primary/50 dark:bg-neutral-500" />

              <div className="flex flex-col gap-2 text-sm md:pr-2 md:text-base">
                <p className="mt-2 mb-1 leading-relaxed">
                  <span className="ml-1 font-medium">نام و نام خانوادگی:</span>
                  {userAddress.fullName}
                </p>
                <p className="text-muted-foreground mb-1 leading-relaxed">
                  <span className="text-foreground ml-1 font-medium">
                    آدرس:
                  </span>
                  {userAddress.city}، {userAddress.streetAddress}
                </p>
                <p className="text-muted-foreground mb-3">
                  <span className="text-foreground ml-1 font-medium">
                    کدپستی:
                  </span>
                  {userAddress.postalCode}
                </p>
              </div>

              <Link href="/shop/checkout/shipping-address">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full cursor-pointer rounded-full px-4 py-2 sm:w-auto dark:border-neutral-600"
                >
                  ویرایش آدرس
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Payment */}
          <Card className="w-full">
            <CardContent className="space-y-2 px-4 py-4 md:px-6">
              <h3 className="text-base font-semibold md:text-lg">روش پرداخت</h3>
              <Separator className="bg-primary/50 dark:bg-neutral-500" />
              <div className="flex flex-col gap-2 text-sm md:text-base">
                <p className="text-muted-foreground mt-2 mb-3 md:pr-2">
                  {user.paymentMethod === "ONLINE"
                    ? "پرداخت آنلاین (درگاه بانکی)"
                    : "کارت به کارت"}
                </p>
                <Link href="/shop/checkout/payment-method">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full cursor-pointer rounded-full px-4 py-2 sm:w-auto dark:border-neutral-600"
                  >
                    تغییر روش پرداخت
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Items */}
          <Card className="w-full">
            <CardContent className="space-y-2 px-0 py-4 md:px-6">
              <h3 className="px-4 pb-4 text-base font-semibold md:px-0 md:text-lg">
                اقلام سفارش
              </h3>
              <Separator className="bg-primary/15 mx-4 mb-2 w-auto md:mx-0 dark:bg-neutral-700" />

              {/* تغییر 2: محصور کردن جدول در یک div اسکرول‌پذیر تا در موبایل بیرون نزند */}
              <div className="w-full overflow-x-auto px-4 pb-2 md:px-0">
                <Table className="min-w-full">
                  <TableHeader>
                    <TableRow className="whitespace-nowrap">
                      <TableHead>محصول</TableHead>
                      <TableHead className="text-center">تعداد</TableHead>
                      <TableHead className="text-right">قیمت</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {(cart.items as CartItem[]).map((item) => (
                      <TableRow key={item.slug}>
                        <TableCell>
                          {/* اختصاص min-width تا عکس و متن محصول روی هم نیفتند */}
                          <div className="flex min-w-50 items-center gap-3 md:min-w-62.5">
                            <div className="shrink-0">
                              <Image
                                src={item.image}
                                alt={item.name}
                                width={50}
                                height={50}
                                className="aspect-video rounded-sm object-cover"
                              />
                            </div>
                            <span className="line-clamp-2 text-sm md:line-clamp-none md:text-base">
                              {item.name}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell className="text-center font-medium">
                          {item.qty}
                        </TableCell>

                        <TableCell className="text-right text-sm whitespace-nowrap md:text-base">
                          {formatPrice(item.price)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT – SUMMARY */}
        <div className="w-full max-w-full">
          <Card className="sticky top-4 w-full">
            <CardContent className="space-y-4 px-4 py-4 md:px-6">
              <h3 className="text-base font-semibold md:text-lg">
                خلاصه سفارش
              </h3>
              <Separator className="bg-primary/50 dark:bg-neutral-500" />

              {/* تغییر 3: اضافه کردن gap-2 و text-right/left در صورت طولانی شدن متون */}
              <div className="mt-2 flex items-center justify-between gap-2 px-1 text-sm">
                <span className="text-muted-foreground shrink-0">
                  جمع اقلام
                </span>
                <span className="text-left font-medium">
                  {formatPrice(cart.itemsPrice)}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2 px-1 text-sm">
                <span className="text-muted-foreground shrink-0">مالیات</span>
                <span className="text-left font-medium">
                  {formatPrice(cart.taxPrice)}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2 px-1 text-sm">
                <span className="text-muted-foreground shrink-0">
                  هزینه ارسال
                </span>
                <span className="text-left text-xs sm:text-sm">
                  تیپاکس (به عهده مشتری)
                </span>
              </div>

              <div className="border-primary/50 mb-6 flex items-center justify-between gap-2 border-t px-1 pt-5 font-semibold dark:border-neutral-600">
                <span className="shrink-0 text-base">مبلغ نهایی</span>
                <span className="text-primary text-left text-lg">
                  {formatPrice(cart.totalPrice)}
                </span>
              </div>

              <PlaceOrderForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

export default PlaceOrderPage;
