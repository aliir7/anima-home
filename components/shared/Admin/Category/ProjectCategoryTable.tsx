"use client";

import { useState } from "react";
import CategoryTableClient from "./CategoryTableClient";

import DeleteCategoryModal from "./DeleteCategoryModal";
import { Category } from "@/types";
import CategoryFormModal from "./CategoryFormModal";

type ProjectCategoryTableProps = {
  categories: Category[];
};

function ProjectCategoryTable({ categories }: ProjectCategoryTableProps) {
  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  return (
    <CategoryTableClient
      categories={categories}
      onCreate={() => {
        setEditing(null);
        setOpenForm(true);
      }}
      onEdit={(category) => {
        setEditing(category);
        setOpenForm(true);
      }}
      onDelete={(id) => {
        setDeletingId(id);
      }}
      renderModals={() => (
        <>
          <CategoryFormModal
            open={openForm}
            onOpenChange={setOpenForm}
            mode="Project"
            initialData={
              editing
                ? {
                    id: editing.id,
                    name: editing.name,
                    parentName: editing.parentName ?? undefined,
                  }
                : undefined
            }
          />

          <DeleteCategoryModal
            open={!!deletingId}
            onOpenChange={() => setDeletingId(null)}
            categoryId={deletingId}
          />
        </>
      )}
    />
  );
}

export default ProjectCategoryTable;
