import Link from "next/link";

import { Order } from "@/types";
import { format } from "date-fns-jalali";
import formatPrice from "@/lib/utils/formatPrice";
import { Badge } from "@/components/ui/badge";
import { Activity } from "react";

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
          href={`/my-account/orders/order/${order.id}`}
          className="hover:bg-muted dark:hover:bg-muted-foreground block rounded-lg border p-4 transition dark:hover:text-neutral-800"
        >
          <div className="flex-between">
            <div className="space-y-1">
              <p className="text-muted text-sm">
                {format(order.createdAt, "yyyy/MM/dd")}
              </p>

              <p className="font-medium">
                مبلغ: {formatPrice(order.totalPrice)}
              </p>
            </div>

            <Activity
              mode={order.paymentMethod === "ONLINE" ? "visible" : "hidden"}
            >
              <div className="flex flex-col items-end gap-2">
                <Badge
                  variant="outline"
                  className="rounded-full px-2 py-1 dark:bg-neutral-200 dark:text-neutral-800"
                >
                  {order.paymentMethod === "ONLINE"
                    ? "پرداخت آنلاین"
                    : "کارت به کارت"}
                </Badge>
                <Badge
                  variant={order.isPaid ? "default" : "destructive"}
                  className="rounded-full px-2 py-1"
                >
                  {order.isPaid ? "پرداخت شده" : "ناموفق"}
                </Badge>
              </div>
            </Activity>
            <Activity
              mode={order.paymentMethod === "CARD" ? "visible" : "hidden"}
            >
              <div className="flex flex-col items-end gap-2">
                <Badge
                  variant="outline"
                  className="rounded-full px-2 py-1 dark:bg-neutral-200 dark:text-neutral-800"
                >
                  {order.paymentMethod === "ONLINE"
                    ? "پرداخت آنلاین"
                    : "کارت به کارت"}
                </Badge>
                <Badge
                  variant={order.isPaid ? "default" : "destructive"}
                  className={
                    !order.isPaid
                      ? "rounded-full bg-yellow-500 px-2 py-1 text-neutral-950"
                      : "rounded-full px-2 py-1"
                  }
                >
                  {order.isPaid ? "پرداخت شده" : "در انتظار پرداخت"}
                </Badge>
              </div>
            </Activity>
          </div>
        </Link>
      ))}
    </div>
  );
}
