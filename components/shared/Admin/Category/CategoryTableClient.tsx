"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

import { CategoryWithParent } from "@/types";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import { Plus, MoreVertical, Pencil, Trash2 } from "lucide-react";
import CategoryFormModal from "./CategoryFormModal";
import DeleteCategoryModal from "./DeleteCategoryModal";

type CategoryTableClientProps = {
  categories: CategoryWithParent[];
};

function CategoryTableClient({ categories }: CategoryTableClientProps) {
  const [createOpen, setCreateOpen] = useState(false);
  const [editCategory, setEditCategory] = useState<CategoryWithParent | null>(
    null,
  );
  const [deleteCategoryId, setDeleteCategoryId] = useState<string | null>(null);

  return (
    <>
      <div className="mb-6 flex justify-start">
        <Button
          onClick={() => setCreateOpen(true)}
          className="rounded-full px-4 py-2"
        >
          <Plus className="h-4 w-4" /> دسته‌بندی جدید
        </Button>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader className="bg-muted">
            <TableRow>
              <TableHead className="text-right">نام</TableHead>
              <TableHead className="text-right">والد</TableHead>
              <TableHead className="text-right">تاریخ ایجاد</TableHead>
              <TableHead className="text-right">عملیات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.length > 0 ? (
              categories.map((cat) => (
                <TableRow key={cat.id}>
                  <TableCell className="text-right">{cat.name}</TableCell>
                  <TableCell className="text-right">
                    {cat.parent?.name ?? cat.parentName ?? "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    {new Date(cat.createdAt!).toLocaleDateString("fa-IR")}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent side="left" align="end">
                        <DropdownMenuItem
                          onClick={() => setEditCategory(cat)}
                          className="flex justify-end gap-2"
                        >
                          ویرایش <Pencil className="h-4 w-4" />
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setDeleteCategoryId(cat.id)}
                          className="flex justify-end gap-2"
                        >
                          حذف <Trash2 className="h-4 w-4" />
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="py-6 text-center">
                  هیچ دسته‌بندی‌ای یافت نشد.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Create Modal */}
      <CategoryFormModal
        type="create"
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        existingCategories={categories}
      />

      {/* Edit Modal */}
      <CategoryFormModal
        type="edit"
        isOpen={!!editCategory}
        onClose={() => setEditCategory(null)}
        initialData={
          editCategory
            ? {
                id: editCategory.id,
                name: editCategory.name,
                parentName: editCategory.parentName ?? "",
              }
            : undefined
        }
        existingCategories={categories}
      />
      {/* Delete Modal */}
      <DeleteCategoryModal
        onClose={() => setDeleteCategoryId(null)}
        categoryId={deleteCategoryId}
      />
    </>
  );
}

export default CategoryTableClient;
