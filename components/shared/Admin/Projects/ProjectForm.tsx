"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { showErrorToast, showSuccessToast } from "@/lib/utils/showToastMessage";
import { createProject, updateProject } from "@/lib/actions/project.actions";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertProjectSchema } from "@/lib/validations/projectsValidations";
import { Category, InsertProjectValues, ProjectFormValues } from "@/types";

type ProjectFormProps = {
  onClose: () => void;
  type: "create" | "edit";
  initialData?: ProjectFormValues;

  categories: Category[];
};

function ProjectForm({
  onClose,
  type,
  initialData,
  categories,
}: ProjectFormProps) {
  const [pending, startTransition] = useTransition();

  const {
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
    register,
  } = useForm<InsertProjectValues>({
    resolver: zodResolver(insertProjectSchema),
    mode: "onSubmit",
    defaultValues: initialData ?? {
      title: "",
      description: "",
      categoryId: "",
      images: [],
      videos: [],
    },
  });

  const onSubmit = (values: InsertProjectValues) => {
    startTransition(async () => {
      if (type === "create") {
        const result = await createProject(values);
        if (result.success) {
          showSuccessToast(
            `پروژه با موفقیت ${type === "create" ? "ایجاد" : "ویرایش"} شد`,
            "bottom-right",
          );
        } else if (initialData?.id) {
          const result = await updateProject(initialData.id, values);
          if (result.success) {
            showSuccessToast(
              `پروژه با موفقیت ${type === "create" ? "ایجاد" : "ویرایش"} شد`,
              "bottom-right",
            );
          }
        } else {
          showErrorToast("شناسه پروژه برای ویرایش موجود نیست", "bottom-right");
          return;
        }

        reset();
        onClose();
      } else {
        showErrorToast("خطا در ذخیره پروژه", "bottom-right");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="title">عنوان پروژه</Label>
        <Input
          id="title"
          {...register("title")}
          disabled={pending || isSubmitting}
        />
        {errors.title && (
          <p className="text-destructive mt-2">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">توضیحات</Label>
        <Textarea
          id="description"
          {...register("description")}
          rows={3}
          disabled={pending || isSubmitting}
        />
        {errors.description && (
          <p className="text-destructive mt-2">{errors.description.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="categoryId">دسته‌بندی</Label>
        <select
          id="categoryId"
          {...register("categoryId")}
          disabled={pending || isSubmitting}
          className="w-full rounded-md border p-2"
        >
          <option value="">انتخاب کنید...</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="images">تصاویر (JSON)</Label>
        <Textarea
          id="images"
          {...register("images")}
          placeholder='["image1.jpg", "image2.jpg"]'
          rows={2}
          disabled={pending || isSubmitting}
        />
        {errors.images && (
          <p className="text-destructive mt-2">{errors.images.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="videos">ویدیوها (JSON - اختیاری)</Label>
        <Textarea
          id="videos"
          {...register("videos")}
          placeholder='["video1.mp4"]'
          rows={2}
          disabled={pending || isSubmitting}
        />
        {errors.videos && (
          <p className="text-destructive mt-2">{errors.videos.message}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={pending || isSubmitting}
        className="mt-4 w-full rounded-full"
      >
        {pending || isSubmitting
          ? "در حال ذخیره..."
          : type === "create"
            ? "ایجاد پروژه"
            : "ذخیره تغییرات"}
      </Button>
    </form>
  );
}

export default ProjectForm;
