"use client";

import { useState, useTransition } from "react";
import { Button } from "../ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Spinner } from "../ui/spinner";
import { showErrorToast, showSuccessToast } from "@/lib/utils/showToastMessage";
import { Trash2 } from "lucide-react";

type DeleteDialogProps = {
  id: string;
  action: (
    id: string,
  ) => Promise<{ success: boolean; message?: string; data?: string }>;
};

function DeleteDialog({ id, action }: DeleteDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      const res = await action(id);

      if (!res.success) {
        showErrorToast(res.message ?? res.data!, "top-right");
      } else {
        setOpen(false);
        showSuccessToast(res.message ?? res.data!, "top-right");
      }
    });
  };
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          size="sm"
          variant="destructive"
          className="flex items-center gap-1 whitespace-nowrap"
        >
          <Trash2 className="h-4 w-4" />
          حذف
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-sm dark:text-white">
        <AlertDialogHeader>
          <AlertDialogTitle className="mr-4 text-right">
            آیا از حذف سفارش مطمئن هستید؟
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone
          </AlertDialogDescription>
          <AlertDialogFooter className="flex justify-end gap-2">
            <AlertDialogCancel className="cursor-pointer transition-all duration-300 dark:hover:bg-neutral-700">
              انصراف
            </AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isPending}
              className="dark:hover:bg-destructive/50 cursor-pointer transition-all duration-300 disabled:cursor-none"
            >
              {isPending ? <Spinner width={3} height={3} /> : "حذف"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteDialog;
