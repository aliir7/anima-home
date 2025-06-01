"use client";

import { useState } from "react";
// import { ProjectWithCategory } from "@/types";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// import EditProjectModal from "./EditProjectModal";
// import DeleteProjectModal from "./DeleteProjectModal";
import { dummyProjects } from "@/db/sampleData";

function ProjectTable() {
  const projects = dummyProjects;
  const [editProjectId, setEditProjectId] = useState<string | null>(null);
  const [deleteProjectId, setDeleteProjectId] = useState<string | null>(null);

  return (
    <>
      <table className="w-full border text-sm md:text-base">
        <thead className="bg-muted">
          <tr className="text-right">
            <th className="p-4">نام پروژه</th>
            <th className="p-4">دسته‌بندی</th>
            <th className="p-4">تاریخ ایجاد</th>
            <th className="p-4">عملیات</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project.id} className="border-b">
              <td className="p-4">{project.title}</td>
              <td className="p-4">{project.category.name}</td>
              <td className="p-4">
                {new Date(project.createdAt).toLocaleDateString("fa-IR")}
              </td>
              <td className="p-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side="left" align="end">
                    <DropdownMenuItem
                      onClick={() => setEditProjectId(project.id)}
                    >
                      ویرایش
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setDeleteProjectId(project.id)}
                    >
                      حذف
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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

export default ProjectTable;
