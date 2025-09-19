"use client";

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
import { deleteMaterial } from "@/lib/actions/materials.actions";

type DeleteMaterialModalProps = {
  materialId: string | null;
  onClose: () => void;
};

function DeleteMaterialModal({
  materialId,
  onClose,
}: DeleteMaterialModalProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  // delete handler
  const handleDelete = () => {
    if (!materialId) {
      return;
    }

    startTransition(async () => {
      const result = await deleteMaterial(materialId);
      if (result.success) {
        showSuccessToast(result.data, "bottom-right");
        onClose();
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
    <Dialog open={!!materialId} onOpenChange={onClose}>
      <DialogContent className="max-w-sm dark:text-white">
        <DialogHeader>
          <DialogTitle className="mr-4 text-right">
            آیا از حذف متریال مطمئن هستید؟
          </DialogTitle>
          <DialogDescription></DialogDescription>
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
export default DeleteMaterialModal;
