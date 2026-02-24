"use client";

import { useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { deleteProject } from "@/lib/actions/project.actions";
import { showErrorToast, showSuccessToast } from "@/lib/utils/showToastMessage";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import { deleteProductAction } from "@/lib/actions/product.actions";

type DeleteModalProps = {
  id: string | null;
  onClose: () => void;
  type?: "project" | "product";
};

export default function DeleteModal({
  id,
  onClose,
  type = "project",
}: DeleteModalProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = async () => {
    if (!id) return;
    startTransition(async () => {
      const result =
        type === "project"
          ? await deleteProject(id)
          : await deleteProductAction(id);

      if (result.success) {
        showSuccessToast(result.message!, "bottom-right");
        onClose();
        router.refresh();
      } else {
        showErrorToast(
          result.error.type === "custom"
            ? result.error.message
            : "خطا در حذف آیتم",
          "bottom-right",
        );
      }
    });
  };

  return (
    <Dialog
      open={!!id}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="max-w-sm dark:text-white">
        <DialogHeader>
          <DialogTitle className="mr-4 text-right">
            آیا از حذف {type === "project" ? "پروژه" : "محصول"} مطمئن هستید؟
          </DialogTitle>
        </DialogHeader>
        <DialogFooter className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="cursor-pointer transition-all duration-300 dark:hover:bg-neutral-700"
          >
            انصراف
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
            className="dark:hover:bg-destructive/50 cursor-pointer transition-all duration-300 disabled:cursor-none"
          >
            {isPending ? <Spinner width={3} height={3} /> : "حذف"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
