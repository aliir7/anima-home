"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogHeader,
  DialogDescription,
} from "@/components/ui/dialog";

import { MaterialFormValues } from "@/types";
import MaterialForm from "./MaterialForm";

type MaterialFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  type: "create" | "edit";
  initialData?: MaterialFormValues & { id: string };
};

function MaterialFormModal({
  isOpen,
  onClose,
  type,
  initialData,
}: MaterialFormModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto py-4">
        <DialogHeader>
          <DialogTitle className="mx-2 mt-6 mb-4 text-right">
            {type === "create" ? "ایجاد متریال جدید" : "ویرایش متریال"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground mt-1 mr-2 text-right text-sm">
            لطفاً اطلاعات متریال را وارد کنید.
          </DialogDescription>
        </DialogHeader>

        <MaterialForm
          onClose={() => onClose()}
          initialData={initialData}
          type={type}
        />
      </DialogContent>
    </Dialog>
  );
}

export default MaterialFormModal;
