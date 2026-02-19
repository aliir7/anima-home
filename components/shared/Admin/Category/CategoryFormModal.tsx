"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import CategoryForm from "./CategoryForm";
import { InsertCategoryValues, UpdateCategoryValues } from "@/types";
import CategoryProductForm from "./CategoryProductForm";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: InsertCategoryValues | UpdateCategoryValues;
  mode: "Product" | "Project";
};

function CategoryFormModal({ open, onOpenChange, initialData, mode }: Props) {
  const isEdit = !!initialData;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="mt-4 mr-2 mb-2 pt-2 text-right">
            {isEdit ? "ویرایش دسته‌بندی" : "ایجاد دسته‌بندی جدید"}
          </DialogTitle>

          <DialogDescription className="text-muted-foreground mt-1 mr-2 text-right text-sm">
            لطفاً اطلاعات دسته‌بندی را وارد کنید.
          </DialogDescription>
        </DialogHeader>
        {mode === "Project" ? (
          <CategoryForm
            onClose={() => onOpenChange(false)}
            initialData={initialData}
            type={initialData ? "edit" : "create"}
          />
        ) : (
          <CategoryProductForm
            onClose={() => onOpenChange(false)}
            initialData={initialData}
            type={initialData ? "edit" : "create"}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

export default CategoryFormModal;
