import CheckoutSteps from "@/components/shared/Shop/Checkout/CheckoutSteps";
import PlaceOrderForm from "@/components/shared/Shop/Checkout/PlaceOrderForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
    <section className="wrapper">
      <CheckoutSteps current={3} />

      <h2 className="py-4 text-2xl font-semibold">بررسی نهایی و ثبت سفارش</h2>

      <div className="grid md:grid-cols-3 md:gap-5">
        {/* LEFT */}
        <div className="space-y-4 md:col-span-2">
          {/* Address */}
          <Card>
            <CardContent className="space-y-2 p-4">
              <h3 className="text-lg font-semibold">آدرس ارسال</h3>

              <p>{userAddress.fullName}</p>
              <p className="text-muted-foreground text-sm">
                {userAddress.streetAddress}، {userAddress.city}،{" "}
                {userAddress.postalCode}
              </p>

              <Link href="/shop/checkout/shipping-address">
                <Button variant="outline" size="sm">
                  ویرایش آدرس
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Payment */}
          <Card>
            <CardContent className="space-y-2 p-4">
              <h3 className="text-lg font-semibold">روش پرداخت</h3>

              <p>
                {user.paymentMethod === "ONLINE"
                  ? "پرداخت آنلاین (درگاه بانکی)"
                  : "کارت به کارت"}
              </p>

              <Link href="shop/checkout/payment-method">
                <Button variant="outline" size="sm">
                  تغییر روش پرداخت
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Items */}
          <Card>
            <CardContent className="p-4">
              <h2 className="pb-4 text-lg font-semibold">اقلام سفارش</h2>

              <Table>
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
                            width={48}
                            height={48}
                          />
                          <span>{item.name}</span>
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
            <CardContent className="space-y-3 p-4">
              <h2 className="text-lg font-semibold">خلاصه سفارش</h2>

              <div className="flex justify-between text-sm">
                <span>جمع اقلام</span>
                <span>{formatPrice(cart.itemsPrice)}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span>مالیات</span>
                <span>{formatPrice(cart.taxPrice)}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span>هزینه ارسال</span>
                <span>تیپاکس (به عهده مشتری)"</span>
              </div>

              <div className="flex justify-between border-t pt-3 font-semibold">
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
