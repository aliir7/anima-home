"use client";
import { InsertProjectValues } from "@/types";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog";
import { getProjectById } from "@/db/queries/projectQueries";
import ProjectForm from "./ProjectForm";

type ProjectFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  type: "create" | "edit";
  projectId?: string;
};

function ProjectFormModal({
  isOpen,
  onClose,
  type,
  projectId,
}: ProjectFormModalProps) {
  const [defaultData, setDefaultData] = useState<InsertProjectValues | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (type === "edit" && projectId) {
      setIsLoading(true);
      getProjectById(projectId).then((data) => {
        setDefaultData({
          title: data.title,
          description: data.description || "",
          categoryId: data.categoryId,
          images: data.images,
          videos: data.videos || [],
        });
        setIsLoading(false);
      });
    } else {
      setDefaultData(null);
    }
  }, [type, projectId]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-right">
            {type === "create" ? "ایجاد پروژه جدید" : "ویرایش پروژه"}
          </DialogTitle>
        </DialogHeader>
        {type === "edit" && isLoading ? (
          <div></div>
        ) : (
          <ProjectForm
            onClose={onClose}
            initialData={defaultData!}
            type={type}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

export default ProjectFormModal;

{
  /* 
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="title">عنوان پروژه</Label>
            <Input id="title" {...register("title")} />
            {errors.title && (
              <p className="text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="description">توضیحات</Label>
            <Textarea id="description" rows={4} {...register("description")} />
            {errors.description && (
              <p className="text-destructive">{errors.description.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="categoryId">دسته‌بندی</Label>
            <select
              id="categoryId"
              {...register("categoryId")}
              className="w-full rounded-md border p-2"
            >
              <option value="">انتخاب کنید</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="text-destructive">{errors.categoryId.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="images">تصاویر (JSON)</Label>
            <Textarea id="images" {...register("images")} />
            {errors.images && (
              <p className="text-destructive">{errors.images.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="videos">ویدیوها (JSON)</Label>
            <Textarea id="videos" {...register("videos")} />
            {errors.videos && (
              <p className="text-destructive">{errors.videos.message}</p>
            )}
          </div>

          <Button type="submit" disabled={pending} className="w-full">
            {pending
              ? "در حال ارسال..."
              : isEdit
                ? "ویرایش پروژه"
                : "ایجاد پروژه"}
          </Button>
        </form> */
}
