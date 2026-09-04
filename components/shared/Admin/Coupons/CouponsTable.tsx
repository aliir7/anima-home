"use client";

import { useState } from "react";
import { format } from "date-fns-jalali";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Pencil } from "lucide-react";
import DeleteDialog from "@/components/shared/DeleteDialog";
import CouponFormDialog from "./CouponFormDialog";
import { deleteCoupon } from "@/lib/actions/coupon.actions";
import formatPrice from "@/lib/utils/formatPrice";
import { coupons } from "@/db/schema";

type Coupon = typeof coupons.$inferSelect;

export default function CouponsTable({
  couponsList,
}: {
  couponsList: Coupon[];
}) {
  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState<Coupon | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          onClick={() => {
            setEditing(null);
            setOpenForm(true);
          }}
          className="rounded-full"
        >
          <Plus className="ml-2 h-4 w-4" />
          کد تخفیف جدید
        </Button>
      </div>

      <div className="overflow-x-auto">
        <Table className="w-full dark:text-neutral-50">
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">کد</TableHead>
              <TableHead className="text-right">تخفیف</TableHead>
              <TableHead className="text-right">استفاده‌شده</TableHead>
              <TableHead className="text-right">انقضا</TableHead>
              <TableHead className="text-right">وضعیت</TableHead>
              <TableHead className="text-center">عملیات</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {couponsList.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-6 text-center">
                  هیچ کد تخفیفی ثبت نشده است.
                </TableCell>
              </TableRow>
            ) : (
              couponsList.map((coupon) => (
                <TableRow key={coupon.id}>
                  <TableCell dir="ltr" className="text-right font-mono">
                    {coupon.code}
                  </TableCell>

                  <TableCell className="text-right">
                    {coupon.type === "percent"
                      ? `${coupon.value}٪`
                      : formatPrice(coupon.value)}
                  </TableCell>

                  <TableCell className="text-right">
                    {coupon.usedCount}
                    {coupon.maxUses != null && ` / ${coupon.maxUses}`}
                  </TableCell>

                  <TableCell className="text-right">
                    {coupon.expiresAt
                      ? format(coupon.expiresAt, "yyyy/MM/dd")
                      : "بدون انقضا"}
                  </TableCell>

                  <TableCell className="text-right">
                    {coupon.isActive ? (
                      <Badge className="bg-green-600 text-white">فعال</Badge>
                    ) : (
                      <Badge variant="outline">غیرفعال</Badge>
                    )}
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          setEditing(coupon);
                          setOpenForm(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <DeleteDialog id={coupon.id} action={deleteCoupon} />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <CouponFormDialog
        open={openForm}
        onOpenChange={setOpenForm}
        initialData={editing}
      />
    </div>
  );
}
