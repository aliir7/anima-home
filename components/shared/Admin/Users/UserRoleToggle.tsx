"use client";

import { useState, useTransition } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import { Spinner } from "@/components/ui/spinner";
import { updateUserRole } from "@/lib/actions/user.actions";
import {
  showErrorToast,
  showSuccessToast,
} from "@/lib/utils/showToastMessage";

type UserRoleToggleProps = {
  userId: string;
  userName: string | null;
  role: "user" | "admin";
};

export default function UserRoleToggle({
  userId,
  userName,
  role,
}: UserRoleToggleProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const isAdmin = role === "admin";
  const nextRole = isAdmin ? "user" : "admin";

  const handleConfirm = () => {
    startTransition(async () => {
      const res = await updateUserRole(userId, nextRole);

      if (!res.success) {
        showErrorToast(
          res.error.type === "custom" ? res.error.message : "خطا رخ داد",
          "top-right",
        );
      } else {
        setOpen(false);
        showSuccessToast(res.data ?? "نقش کاربر تغییر کرد", "top-right");
      }
    });
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <Switch
          checked={isAdmin}
          onCheckedChange={() => setOpen(true)}
          disabled={isPending}
        />
        <span className="text-sm">{isAdmin ? "ادمین" : "کاربر عادی"}</span>
      </div>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent className="max-w-sm dark:text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-right">
              {isAdmin
                ? `دسترسی ادمین «${userName ?? "این کاربر"}» گرفته شود؟`
                : `«${userName ?? "این کاربر"}» به ادمین ارتقا یابد؟`}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-right">
              {isAdmin
                ? "این کاربر دیگر به پنل مدیریت دسترسی نخواهد داشت."
                : "این کاربر به تمام بخش‌های پنل مدیریت (محصولات، سفارش‌ها، کاربران و ...) دسترسی کامل پیدا می‌کند."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex justify-end gap-2">
            <AlertDialogCancel className="cursor-pointer">
              انصراف
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <button
                onClick={handleConfirm}
                disabled={isPending}
                className="bg-primary hover:bg-primary/90 flex cursor-pointer items-center gap-2 rounded-md px-4 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isPending && <Spinner width={3} height={3} />}
                تایید
              </button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
