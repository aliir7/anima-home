"use client";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Pencil, Trash2, MoreVertical, Plus } from "lucide-react";

import {
  Category,
  Product,
  ProductCategoryWithParent,
  ProductWithRelations,
} from "@/types";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import DeleteModal from "../Projects/DeleteModal";

type ProductTableClientProps = {
  categories: Category[];
  product: ProductWithRelations[];
  currentPage: number;
  totalPages: number;
  basePath?: string;
};

function ProductTableClient({
  categories,
  product,
  currentPage,
  totalPages,
  basePath,
}: ProductTableClientProps) {
  const [page, setPage] = useState(currentPage);

  const [deleteProductId, setDeleteProductId] = useState<string | null>(null);
  const router = useRouter();

  // pagination handler
  const onPageChange = (newPage: number) => {
    setPage(newPage);
    router.push(`${basePath}?page=${newPage}`);
  };
  return (
    <>
      {/* دکمه ساخت پروژه */}
      <div className="mb-4 flex justify-start">
        <Button
          className="bg-primary hover:bg-primary/80 cursor-pointer rounded-full text-white dark:bg-neutral-800 dark:hover:bg-neutral-600"
          onClick={() => router.push(`${basePath}/new`)}
        >
          <Plus className="ml-2 h-4 w-4" /> ایجاد محصول جدید
        </Button>
      </div>
      <div className="rounded-lg border">
        <Table>
          <TableHeader className="bg-muted">
            <TableRow>
              <TableHead className="text-right">نام پروژه</TableHead>
              <TableHead className="text-right">در گروه</TableHead>
              <TableHead className="text-right">دسته‌بندی</TableHead>
              <TableHead className="text-right">تاریخ ایجاد</TableHead>
              <TableHead className="text-right">عملیات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {product.length > 0 ? (
              product.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="text-right">{product.title}</TableCell>
                  <TableCell className="text-right">
                    {product.category?.parentName ?? "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    {product.category?.name ?? "نامشخص"}
                  </TableCell>

                  <TableCell className="text-right">
                    {new Date(product.createdAt!).toLocaleDateString("fa-IR")}
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
                          asChild
                          className="flex justify-end gap-2"
                        >
                          <Link href={`/admin/products/${product.id}`}>
                            ویرایش <Pencil className="h-4 w-4" />
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="flex justify-end gap-2"
                          onClick={() => setDeleteProductId(product.id)}
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
                  هیچ محصولی یافت نشد.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <DeleteModal
        type="product"
        id={deleteProductId}
        onClose={() => setDeleteProductId(null)}
      />
    </>
  );
}

export default ProductTableClient;
