"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

import { Plus, MoreVertical, Pencil, Trash2, Search } from "lucide-react";

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
  // این لیست معمولاً کوچک است (چند ده دسته‌بندی)، پس فیلتر آنی سمت
  // کلاینت — بدون رفت‌وبرگشت به سرور — ساده‌ترین و سریع‌ترین راه‌حل است
  const [search, setSearch] = useState("");

  const filteredCategories = useMemo(() => {
    if (!search.trim()) return categories;
    const q = search.trim().toLowerCase();
    return categories.filter((cat) => cat.name.toLowerCase().includes(q));
  }, [categories, search]);

  return (
    <>
      {/* Create Button + Search */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Button onClick={onCreate} className="rounded-full px-4 py-2">
          <Plus className="h-4 w-4" /> دسته‌بندی جدید
        </Button>

        <div className="relative w-full max-w-55">
          <Search className="text-muted-foreground pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="جستجوی دسته‌بندی..."
            className="rounded-full pr-9"
          />
        </div>
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
            {filteredCategories.length > 0 ? (
              filteredCategories.map((cat) => (
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
                  {search
                    ? `دسته‌بندی‌ای برای «${search}» یافت نشد.`
                    : "هیچ دسته‌بندی‌ای یافت نشد."}
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
