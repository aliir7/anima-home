import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Metadata } from "next";
import { getOrderSummary } from "@/lib/actions/order.actions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BadgeDollarSign, CreditCard, Users, Barcode } from "lucide-react";
import { format } from "date-fns-jalali";
import AdminChart from "@/components/shared/Admin/AdminChart";
import Link from "next/link";

export const metadata: Metadata = {
  title: "داشبورد",
};

export default async function AdminDashboardPage() {
  const summary = await getOrderSummary();

  const totalSales = summary.salesData.map((sales) => sales.totalSales);

  return (
    <div className="space-y-2">
      <h2 className="h2-bold mb-3 dark:text-neutral-50">داشبورد</h2>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">مجموع درآمد</CardTitle>
            <BadgeDollarSign />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSales}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              تعداد سفارش‌ها
            </CardTitle>
            <CreditCard />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.ordersCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">مشتریان</CardTitle>
            <Users />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.usersCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">محصولات</CardTitle>
            <Barcode />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.productsCount}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>نمای کلی</CardTitle>
          </CardHeader>
          <CardContent>
            <AdminChart
              data={{
                salesData: summary.salesData,
              }}
            />
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>آخرین سفارش‌ها</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">خریدار</TableHead>
                  <TableHead className="text-right">تاریخ</TableHead>
                  <TableHead className="text-right">مبلغ</TableHead>
                  <TableHead className="text-right">عملیات</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {summary.latestOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      {order?.user?.name ? order.user.name : "کاربر حذف‌شده"}
                    </TableCell>
                    <TableCell>
                      {format(order.createdAt, "yyyy/MM/dd")}
                    </TableCell>
                    <TableCell>{order.totalPrice}</TableCell>
                    <TableCell>
                      <Link href={`/order/${order.id}`}>
                        <span className="px-2">جزئیات</span>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
