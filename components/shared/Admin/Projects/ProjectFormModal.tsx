"use client";

import { createProject } from "@/lib/actions/project.actions";
import { showErrorToast, showSuccessToast } from "@/lib/utils/showToastMessage";
import { insertProjectSchema } from "@/lib/validations/projectsValidations";
import { InsertProjectValues } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogTitle,
  DialogTrigger,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { categories } from "@/lib/constants";

type ProjectFormModalProps = {
  isEdit?: boolean;
  defaultValues?: InsertProjectValues;
  trigger: React.ReactNode;
};

function ProjectFormModal({
  isEdit,
  defaultValues,
  trigger,
}: ProjectFormModalProps) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InsertProjectValues>({
    resolver: zodResolver(insertProjectSchema),
    mode: "onSubmit",
    defaultValues: defaultValues || {
      title: "",
      description: "",
      categoryId: "",
      images: [],
      videos: [],
    },
  });

  const onSubmit = (data: InsertProjectValues) => {
    startTransition(async () => {
      const result = await createProject(data);
      if (result.success) {
        showSuccessToast(
          isEdit ? "پروژه با موفقیت ویرایش شد" : "پروژه جدید ایجاد شد",
          "bottom-right",
        );
        reset();
        setOpen(false);
      } else {
        showErrorToast("خطا در ثبت پروژه", "bottom-right");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "ویرایش پروژه" : "ایجاد پروژه جدید"}
          </DialogTitle>
        </DialogHeader>

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
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default ProjectFormModal;
