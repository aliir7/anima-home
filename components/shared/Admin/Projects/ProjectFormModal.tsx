"use client";

import { Category, ProjectFormValues } from "@/types";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogHeader,
  DialogDescription,
} from "@/components/ui/dialog";
import ProjectForm from "./ProjectForm";

type ProjectFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  type: "create" | "edit";
  initialData?: ProjectFormValues;
  categories: Category[];
};

function ProjectFormModal({
  isOpen,
  onClose,
  type,
  initialData,
  categories,
}: ProjectFormModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="mt-4 mb-2 text-right">
            {type === "create" ? "ایجاد پروژه جدید" : "ویرایش پروژه"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground mt-1 mr-2 text-right text-sm">
            لطفاً اطلاعات پروژه را وارد کنید.
          </DialogDescription>
        </DialogHeader>

        <ProjectForm
          onClose={() => onClose()}
          initialData={initialData}
          categories={categories}
          type={type}
        />
      </DialogContent>
    </Dialog>
  );
}

export default ProjectFormModal;
