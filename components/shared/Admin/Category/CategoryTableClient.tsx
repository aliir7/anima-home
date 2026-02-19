"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import { Plus, MoreVertical, Pencil, Trash2 } from "lucide-react";

type BaseCategory = {
  id: string;
  name: string;
  createdAt?: Date | string | null;
  parent?: { name: string } | null;
  parentName?: string | null;
};

type Props<T extends BaseCategory> = {
  categories: T[];
  onCreate: () => void;
  onEdit: (category: T) => void;
  onDelete: (id: string) => void;
  renderModals?: () => React.ReactNode;
};

function CategoryTableClient<T extends BaseCategory>({
  categories,
  onCreate,
  onEdit,
  onDelete,
  renderModals,
}: Props<T>) {
  return (
    <>
      {/* Create Button */}
      <div className="mb-6 flex justify-start">
        <Button onClick={onCreate} className="rounded-full px-4 py-2">
          <Plus className="h-4 w-4" /> دسته‌بندی جدید
        </Button>
      </div>

      {/* Table */}
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
                    {cat.createdAt
                      ? new Date(cat.createdAt).toLocaleDateString("fa-IR")
                      : "-"}
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
                          onClick={() => onEdit(cat)}
                          className="flex justify-end gap-2"
                        >
                          ویرایش <Pencil className="h-4 w-4" />
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => onDelete(cat.id)}
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

      {/* Modals from Container */}
      {renderModals?.()}
    </>
  );
}

export default CategoryTableClient;
