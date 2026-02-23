import Link from "next/link";

import { Order } from "@/types";
import { format } from "date-fns-jalali";
import formatPrice from "@/lib/utils/formatPrice";
import { Badge } from "@/components/ui/badge";

type UserOrdersListProps = {
  orders: Order[];
};

export default function UserOrdersList({ orders }: UserOrdersListProps) {
  if (orders.length === 0) {
    return (
      <p className="text-muted-foreground text-center">
        هنوز سفارشی ثبت نکرده‌اید
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Link
          key={order.id}
          href={`my-account/orders/order/${order.id}`}
          className="hover:bg-muted block rounded-lg border p-4 transition"
        >
          <div className="flex-between">
            <div className="space-y-1">
              <p className="text-muted-foreground text-sm">
                {format(order.createdAt, "yyyy/MM/dd")}
              </p>

              <p className="font-medium">
                مبلغ: {formatPrice(order.totalPrice)}
              </p>
            </div>

            <div className="flex flex-col items-end gap-2">
              <Badge variant="outline">
                {order.paymentMethod === "ONLINE"
                  ? "پرداخت آنلاین"
                  : "کارت به کارت"}
              </Badge>

              <Badge variant={order.isPaid ? "default" : "destructive"}>
                {order.isPaid ? "پرداخت شده" : "ناموفق"}
              </Badge>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
