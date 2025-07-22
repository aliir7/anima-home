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

type DeleteProjectModalProps = {
  projectId: string | null;
  onClose: () => void;
};

export default function DeleteProjectModal({
  projectId,
  onClose,
}: DeleteProjectModalProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = () => {
    if (!projectId) return;
    startTransition(async () => {
      const result = await deleteProject(projectId);

      if (result.success) {
        showSuccessToast(result.data, "bottom-right");
        onClose();
        router.refresh();
      } else {
        showErrorToast(
          result.error.type === "custom"
            ? result.error.message
            : "خطا در حذف پروژه",
          "bottom-right",
        );
      }
    });
  };

  return (
    <Dialog
      open={!!projectId}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="max-w-sm dark:text-white">
        <DialogHeader>
          <DialogTitle className="mr-4 text-right">
            آیا از حذف پروژه مطمئن هستید؟
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
            className="dark:hover:bg-destructive/50 cursor-pointer transition-all duration-300"
          >
            {isPending ? "در حال حذف پروژه..." : "حذف"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
