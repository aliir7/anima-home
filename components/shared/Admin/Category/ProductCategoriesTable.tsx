"use client";

import { Category } from "@/types";
import { useState } from "react";
import CategoryTableClient from "./CategoryTableClient";
import CategoryFormModal from "./CategoryFormModal";
import DeleteCategoryModal from "./DeleteCategoryModal";

function ProductCategoriesTable({ categories }: { categories: Category[] }) {
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
            mode="Product"
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

export default ProductCategoriesTable;
