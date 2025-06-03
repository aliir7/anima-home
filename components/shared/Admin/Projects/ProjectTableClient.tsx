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
import { Pencil, Trash2, MoreVertical } from "lucide-react";
import EditProjectModal from "./EditProjectModal";
import DeleteProjectModal from "./DeleteProjectModal";
import { dummyProjects } from "@/db/sampleData";

function ProjectTableClient() {
  const [editProjectId, setEditProjectId] = useState<string | null>(null);
  const [deleteProjectId, setDeleteProjectId] = useState<string | null>(null);
  const projects = dummyProjects;
  return (
    <>
      <div className="rounded-lg border">
        <Table>
          <TableHeader className="bg-muted">
            <TableRow>
              <TableHead className="text-right">نام پروژه</TableHead>
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
                  <TableCell className="text-right">
                    {project.category?.name ?? "نامشخص"}
                  </TableCell>
                  <TableCell className="text-right">
                    {new Date(project.createdAt).toLocaleDateString("fa-IR")}
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
                          onClick={() => setEditProjectId(project.id)}
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
      <EditProjectModal
        projectId={editProjectId}
        onClose={() => setEditProjectId(null)}
      />
      <DeleteProjectModal
        projectId={deleteProjectId}
        onClose={() => setDeleteProjectId(null)}
      />
    </>
  );
}
export default ProjectTableClient;
