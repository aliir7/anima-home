"use client";

import { CategoryWithParent, InsertProjectValues } from "@/types";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog";
import ProjectForm from "./ProjectForm";

type ProjectFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  type: "create" | "edit";
  initialData?: InsertProjectValues;
  categories: CategoryWithParent[];
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
        </DialogHeader>

        <ProjectForm
          onClose={onClose}
          initialData={initialData}
          categories={categories}
          type={type}
        />
      </DialogContent>
    </Dialog>
  );
}

export default ProjectFormModal;
