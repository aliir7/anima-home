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
    <section className="wrapper px-6 py-12">
      <CheckoutSteps current={3} />

      <h2 className="text-primary py-4 text-2xl font-semibold dark:text-neutral-950">
        بررسی نهایی و ثبت سفارش
      </h2>

      <div className="grid md:grid-cols-3 md:gap-5">
        {/* LEFT */}
        <div className="space-y-5 md:col-span-2">
          {/* Address */}
          <Card>
            <CardContent className="space-y-2 px-6 py-4">
              <h3 className="text-lg font-semibold">آدرس ارسال</h3>
              <Separator className="bg-primary/50 dark:bg-neutral-500" />

              <div className="flex flex-col gap-2 pr-2">
                <p className="mt-2 mb-1">
                  <span className="ml-1">نام و نام خانوادگی:</span>
                  {userAddress.fullName}
                </p>
                <p className="text-muted-foreground mb-1 text-sm">
                  <span className="ml-1">آدرس:</span>
                  {userAddress.city}، {userAddress.streetAddress}
                </p>
                <p className="text-muted-foreground mb-3 text-sm">
                  <span className="ml-1">کدپستی:</span>
                  {userAddress.postalCode}
                </p>
              </div>

              <Link href="/shop/checkout/shipping-address">
                <Button
                  variant="outline"
                  size="sm"
                  className="cursor-pointer rounded-full px-4 py-2 dark:border-neutral-600"
                >
                  ویرایش آدرس
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Payment */}
          <Card>
            <CardContent className="space-y-2 px-6 py-4">
              <h3 className="text-lg font-semibold">روش پرداخت</h3>
              <Separator className="bg-primary/50 dark:bg-neutral-500" />
              <div className="flex flex-col gap-2">
                <p className="text-muted-foreground mt-2 mb-3 pr-2 text-sm">
                  {user.paymentMethod === "ONLINE"
                    ? "پرداخت آنلاین (درگاه بانکی)"
                    : "کارت به کارت"}
                </p>
                <Link href="/shop/checkout/payment-method">
                  <Button
                    variant="outline"
                    size="sm"
                    className="cursor-pointer rounded-full px-4 py-2 dark:border-neutral-600"
                  >
                    تغییر روش پرداخت
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Items */}
          <Card>
            <CardContent className="space-y-2 px-6 py-4">
              <h3 className="pb-4 text-lg font-semibold">اقلام سفارش</h3>
              <Separator className="bg-primary/15 dark:bg-neutral-700" />
              <Table className="pr-2">
                <TableHeader>
                  <TableRow>
                    <TableHead>محصول</TableHead>
                    <TableHead className="text-center">تعداد</TableHead>
                    <TableHead className="text-right">قیمت</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {(cart.items as CartItem[]).map((item) => (
                    <TableRow key={item.slug}>
                      <TableCell>
                        <Link
                          href={`/shop/product/${item.slug}`}
                          className="flex items-center gap-2"
                        >
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={50}
                            height={50}
                            className="aspect-video"
                          />
                          <span className="ml-1">{item.name}</span>
                        </Link>
                      </TableCell>

                      <TableCell className="text-center">{item.qty}</TableCell>

                      <TableCell className="text-right">
                        {formatPrice(item.price)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT – SUMMARY */}
        <div>
          <Card>
            <CardContent className="space-y-4 px-6 py-4">
              <h3 className="text-lg font-semibold">خلاصه سفارش</h3>
              <Separator className="bg-primary/50 dark:bg-neutral-500" />

              <div className="mt-2 flex justify-between px-2 text-sm">
                <span>جمع اقلام</span>
                <span>{formatPrice(cart.itemsPrice)}</span>
              </div>

              <div className="flex justify-between px-2 text-sm">
                <span>مالیات</span>
                <span>{formatPrice(cart.taxPrice)}</span>
              </div>

              <div className="flex justify-between px-2 text-sm">
                <span>هزینه ارسال</span>
                <span>تیپاکس (به عهده مشتری)</span>
              </div>

              <div className="border-primary/50 mb-8 flex justify-between border-t px-2 pt-5 font-semibold dark:border-neutral-600">
                <span>مبلغ نهایی</span>
                <span>{formatPrice(cart.totalPrice)}</span>
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
