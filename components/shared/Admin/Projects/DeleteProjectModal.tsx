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

type DeleteProjectModalProps = {
  projectId: string | null;
  onClose: () => void;
};

export default function DeleteProjectModal({
  projectId,
  onClose,
}: DeleteProjectModalProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!projectId) return;
    startTransition(async () => {
      const result = await deleteProject(projectId);

      if (result.success) {
        showSuccessToast(result.data, "bottom-right");
        onClose();
      } else {
        showErrorToast(
          result.error.type === "custom"
            ? result.error.message
            : "خطا در بروزرسانی پروژه",
          "bottom-right",
        );
      }
    });
  };

  return (
    <Dialog open={!!projectId} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-sm dark:text-white">
        <DialogHeader>
          <DialogTitle className="mr-4 text-right">
            آیا از حذف پروژه مطمئن هستید؟
          </DialogTitle>
        </DialogHeader>
        <DialogFooter className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => onClose()}
            className="cursor-pointer transition-all duration-300 dark:hover:bg-neutral-700"
          >
            انصراف
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
            className="dark:hover:bg-destructive/50 cursor-pointer transition-all duration-300"
          >
            {isPending ? "در حال حذف پروژه..." : "حذف"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
