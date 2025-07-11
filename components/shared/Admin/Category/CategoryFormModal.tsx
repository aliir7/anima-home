"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import CategoryForm from "./CategoryForm";
import { InsertCategoryValues } from "@/types";

type CategoryFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  type: "create" | "edit";
  initialData?: InsertCategoryValues;
};

function CategoryFormModal({
  isOpen,
  onClose,
  type,
  initialData,
}: CategoryFormModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="mt-4 mr-2 mb-2 pt-2 text-right">
            {type === "create" ? "ایجاد دسته‌بندی جدید" : "ویرایش دسته‌بندی"}
          </DialogTitle>
        </DialogHeader>

        <CategoryForm onClose={onClose} type={type} initialData={initialData} />
      </DialogContent>
    </Dialog>
  );
}

export default CategoryFormModal;
