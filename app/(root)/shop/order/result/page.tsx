import OrderFailed from "@/components/shared/Shop/Checkout/OrderFailed";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Row from "@/components/ui/Row";
import { Separator } from "@/components/ui/separator";
import { getOrderById } from "@/lib/actions/order.actions";
import formatPrice from "@/lib/utils/formatPrice";
import { CheckCircle2, Badge } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

type OrderResultPageProps = {
  searchParams: Promise<{
    orderId?: string;
    trackId?: string;
    status?: "success" | 2;
  }>;
};

export default async function OrderResultPage({
  searchParams,
}: OrderResultPageProps) {
  const { orderId, status, trackId } = await searchParams;

  if (!orderId || !status) notFound();

  const order = await getOrderById(orderId);
  if (!order) notFound();

  if (!trackId && status === 2) {
    return <OrderFailed orderId={orderId} />;
  }

  return (
    <div className="wrapper max-w-2xl py-10">
      <Card>
        <CardHeader className="space-y-2 text-center">
          <CheckCircle2 className="mx-auto h-12 w-12 text-green-600" />
          <CardTitle>پرداخت با موفقیت انجام شد</CardTitle>

          <Badge className="mx-auto bg-green-600">پرداخت آنلاین</Badge>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="bg-muted rounded-md p-4 text-sm leading-7">
            ✅ پرداخت شما با موفقیت انجام شد و سفارش نهایی گردید.
          </div>

          <Separator />

          <div className="space-y-2 text-sm">
            <Row label="شماره سفارش" value={order.id} />
            <Row
              label="مبلغ پرداخت‌شده"
              value={`${formatPrice(order.totalPrice)} تومان`}
            />
            <Row label="وضعیت پرداخت" value="پرداخت موفق ✅" />
          </div>

          <Separator />

          <div className="flex flex-col gap-3">
            <Button asChild>
              <Link href={`/order/${order.id}`}>مشاهده جزئیات سفارش</Link>
            </Button>

            <Button variant="outline" asChild>
              <Link href="/shop">بازگشت به فروشگاه</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
