import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import CategoryForm from "./CategoryForm";
import { Category, CategoryWithParent } from "@/types";

type CategoryFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  type: "create" | "edit";
  initialData?: Category;
  categories: CategoryWithParent[];
};

function CategoryFormModal({
  isOpen,
  onClose,
  type,
  initialData,
  categories,
}: CategoryFormModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="mt-4 mb-2 text-right">
            {type === "create" ? "ایجاد دسته‌بندی جدید" : "ویرایش دسته‌بندی"}
          </DialogTitle>
        </DialogHeader>
        <CategoryForm
          onClose={onClose}
          initialData={initialData}
          type={type}
          categories={categories.filter((c) => c.id !== initialData?.id)}
        />
      </DialogContent>
    </Dialog>
  );
}

export default CategoryFormModal;
