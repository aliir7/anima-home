"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Material } from "@/types";
import { MoreVertical, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import MaterialFormModal from "./MaterialFormModal";
import DeleteMaterialModal from "./DeleteMaterialModal";
import PaginationControls from "../../Pagination/PaginationControls";
import { normalizeMaterialForForm } from "@/lib/utils/normalize";

type MaterialTableClientProps = {
  materials: Material[];
  currentPage: number;
  totalPages: number;
  basePath?: string;
};

function MaterialTableClient({
  materials,
  currentPage,
  totalPages,
  basePath,
}: MaterialTableClientProps) {
  const [showMaterials, setShowMaterials] = useState(false);
  const [editMaterials, setEditMaterials] = useState<Material | null>(null);
  const [deleteMaterialId, setDeleteMaterialId] = useState<string | null>(null);
  const [page, setPage] = useState(currentPage);
  const router = useRouter();

  // pagination handler
  const onPageChange = (newPage: number) => {
    setPage(newPage);
    router.push(`${basePath}?page=${newPage}`);
  };

  return (
    <>
      {/* دکمه ساخت متریال */}
      <div className="mb-4 flex justify-start">
        <Button
          className="bg-primary hover:bg-primary/80 cursor-pointer rounded-full text-white dark:bg-neutral-800 dark:hover:bg-neutral-600"
          onClick={() => setShowMaterials(true)}
        >
          <Plus className="ml-2 h-4 w-4" /> ایجاد متریال جدید
        </Button>
      </div>

      {/* جدول پروژه‌ها */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader className="bg-muted">
            <TableRow>
              <TableHead className="text-right">عنوان متریال</TableHead>
              <TableHead className="text-right">توضیحات</TableHead>
              <TableHead className="text-right">عملیات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {materials.length > 0 ? (
              materials.map((material) => (
                <TableRow key={material.id}>
                  <TableCell className="text-right">{material.title}</TableCell>
                  <TableCell className="text-right">
                    {material.description}
                  </TableCell>

                  <TableCell className="text-right">
                    {new Date(material.createdAt!).toLocaleDateString("fa-IR")}
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
                          className="flex justify-end gap-2"
                          onClick={() => setEditMaterials(material)}
                        >
                          ویرایش <Pencil className="h-4 w-4" />
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="flex justify-end gap-2"
                          onClick={() => setDeleteMaterialId(material.id)}
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
                <TableCell colSpan={5} className="py-6 text-center">
                  هیچ پروژه‌ای یافت نشد.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Create Modal */}
      <MaterialFormModal
        type="create"
        isOpen={showMaterials}
        onClose={() => setShowMaterials(false)}
      />

      {/* Edit Modal */}
      <MaterialFormModal
        type="edit"
        isOpen={!!editMaterials}
        onClose={() => setEditMaterials(null)}
        initialData={
          editMaterials ? normalizeMaterialForForm(editMaterials) : undefined
        }
      />
      {/* Delete Modal */}
      <DeleteMaterialModal
        materialId={deleteMaterialId}
        onClose={() => setDeleteMaterialId(null)}
      />
      {/* Pagination */}
      <PaginationControls
        totalPages={totalPages}
        currentPage={page}
        onPageChange={onPageChange}
      />
    </>
  );
}

export default MaterialTableClient;
