"use client";

import { useState } from "react";
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
import DeleteProjectModal from "./DeleteProjectModal";
import ProjectFormModal from "./ProjectFormModal";
import { Category, ProjectWithCategory } from "@/types";
import { normalizeProjectForForm } from "@/lib/utils/normalize";
// import Image from "next/image";

type ProjectTableClientProps = {
  categories: Category[];
  projects: ProjectWithCategory[];
};

function ProjectTableClient({ categories, projects }: ProjectTableClientProps) {
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [editProject, setEditProject] = useState<ProjectWithCategory | null>(
    null,
  );
  const [deleteProjectId, setDeleteProjectId] = useState<string | null>(null);

  return (
    <>
      {/* دکمه ساخت پروژه */}
      <div className="mb-4 flex justify-end">
        <Button
          className="bg-primary hover:bg-primary/80 rounded-full text-white dark:bg-neutral-800 dark:hover:bg-neutral-600"
          onClick={() => setShowCreateProject(true)}
        >
          <Plus className="ml-2 h-4 w-4" /> ایجاد پروژه جدید
        </Button>
      </div>

      {/* جدول پروژه‌ها */}
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
            {projects.length > 0 ? (
              projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="text-right">{project.title}</TableCell>
                  <TableCell className="text-right">سرگروه</TableCell>
                  <TableCell className="text-right">
                    {project.category?.name ?? "نامشخص"}
                  </TableCell>

                  <TableCell className="text-right">
                    {new Date(project.createdAt!).toLocaleDateString("fa-IR")}
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
                          onClick={() => setEditProject(project)}
                        >
                          ویرایش <Pencil className="h-4 w-4" />
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="flex justify-end gap-2"
                          onClick={() => setDeleteProjectId(project.id)}
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
                  هیچ پروژه‌ای یافت نشد.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Create Modal */}
      <ProjectFormModal
        type="create"
        isOpen={showCreateProject}
        onClose={() => setShowCreateProject(false)}
        categories={categories}
      />
      {/* Edit Modal */}
      <ProjectFormModal
        type="edit"
        isOpen={!!editProject}
        initialData={
          editProject ? normalizeProjectForForm(editProject) : undefined
        }
        onClose={() => setEditProject(null)}
        categories={categories}
      />
      {/* Delete Modal */}
      <DeleteProjectModal
        projectId={deleteProjectId}
        onClose={() => setDeleteProjectId(null)}
      />
    </>
  );
}
export default ProjectTableClient;
