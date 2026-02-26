import DeleteDialog from "@/components/shared/DeleteDialog";
import PaginationControls from "@/components/shared/Pagination/PaginationControls";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deleteOrder, getAllOrders } from "@/lib/actions/order.actions";
import { requireAdmin } from "@/lib/auth/authGuard";
import formatPrice from "@/lib/utils/formatPrice";
import { format } from "date-fns-jalali";
import Link from "next/link";
// ایمپورت‌های کامپوننت‌های UI خودتان را اینجا قرار دهید (Button, Table, formatDateTime و ...)

export default async function AdminOrdersPage({
  searchParams,
}: {
  // تایپ‌ها را optional می‌کنیم چون ممکن است در لود اولیه URL پارامتری نداشته باشد
  searchParams: Promise<{ page?: string; query?: string }>;
}) {
  // 1. استخراج مقادیر از searchParams به صورت Promise (Next.js 15)
  const resolvedParams = await searchParams;
  const pageNumber = Number(resolvedParams.page) || 1;
  const query = resolvedParams.query || "";

  // 2. احراز هویت ادمین
  await requireAdmin();

  // 3. دریافت داده‌ها از اکشن
  const result = await getAllOrders({
    page: pageNumber,
    query: query,
  });

  // 4. مدیریت حالت خطا (Guard Clause)
  if (!result.success) {
    return (
      <div className="rounded-md border border-red-200 bg-red-50 p-4 text-red-600">
        <h2>متاسفانه مشکلی پیش آمد:</h2>
        <p>
          {result.error.type === "custom"
            ? result.error.message
            : "خطای ناشناخته"}
        </p>
      </div>
    );
  }

  // در این مرحله تایپ اسکریپت مطمئن است که result.success برابر true است و result.data وجود دارد
  const { ordersList, totalPages } = result.data!;

  return (
    <div className="overflow-x-auto">
      <Table className="w-full table-fixed dark:text-neutral-50">
        <TableHeader>
          <TableRow>
            <TableHead className="w-35 text-right">شماره ارجاع</TableHead>
            <TableHead className="w-30 text-right">تاریخ</TableHead>
            <TableHead className="w-40 text-right">خریدار</TableHead>
            <TableHead className="w-35 text-right">مبلغ کل</TableHead>
            <TableHead className="w-40 text-right">وضعیت پرداخت</TableHead>
            <TableHead className="w-40 text-right">وضعیت ارسال</TableHead>
            <TableHead className="w-40 text-center">عملیات</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {ordersList.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="py-6 text-center">
                هیچ سفارشی یافت نشد.
              </TableCell>
            </TableRow>
          ) : (
            ordersList.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="w-35 text-right font-medium">
                  {order.refNumber}
                </TableCell>

                <TableCell className="w-30 text-right">
                  {format(order.createdAt, "yyyy/MM/dd")}
                </TableCell>

                <TableCell className="w-40 text-right">
                  {order.user.name}
                </TableCell>

                <TableCell className="w-35 text-right whitespace-nowrap">
                  {formatPrice(order.totalPrice)}
                </TableCell>

                <TableCell className="w-40 text-right">
                  {order.isPaid && order.paidAt
                    ? format(order.paidAt, "yyyy/MM/dd")
                    : "پرداخت نشده"}
                </TableCell>

                <TableCell className="w-40 text-right">
                  {order.isDelivered && order.deliveredAt
                    ? format(order.deliveredAt, "yyyy/MM/dd")
                    : "ارسال نشده"}
                </TableCell>

                {/* ✅ Actions – FIXED */}
                <TableCell className="w-40">
                  <div className="flex justify-center gap-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/order/${order.id}`}>جزئیات</Link>
                    </Button>

                    <DeleteDialog id={order.id} action={deleteOrder} />
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
