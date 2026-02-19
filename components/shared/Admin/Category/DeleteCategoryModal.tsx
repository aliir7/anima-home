"use client";

import { deleteCategoryAction } from "@/lib/actions/category.actions";
import { showErrorToast, showSuccessToast } from "@/lib/utils/showToastMessage";
import { useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

type DeleteCategoryModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categoryId: string | null;
};

function DeleteCategoryModal({
  categoryId,
  onOpenChange,
  open,
}: DeleteCategoryModalProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  // delete handler
  const handleDelete = () => {
    if (!categoryId) {
      return;
    }

    startTransition(async () => {
      const result = await deleteCategoryAction(categoryId);
      if (result.success) {
        showSuccessToast(result.data, "bottom-right");
        onOpenChange(false);
        router.refresh();
      } else {
        showErrorToast(
          result.error.type === "custom"
            ? result.error.message
            : "خطا در حذف دسته بندی",
          "bottom-right",
        );
      }
    });
  };
  return (
    <Dialog open={!!categoryId} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm dark:text-white">
        <DialogHeader>
          <DialogTitle className="mr-4 text-right">
            آیا از حذف دسته بندی مطمئن هستید؟
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="cursor-pointer transition-all duration-300 dark:hover:bg-neutral-700"
          >
            انصراف
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            className="dark:hover:bg-destructive/50 cursor-pointer transition-all duration-300"
            disabled={isPending}
          >
            {isPending ? "در حال حذف..." : "حذف"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
export default DeleteCategoryModal;
