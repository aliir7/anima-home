"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { showErrorToast, showSuccessToast } from "@/lib/utils/showToastMessage";
import { createProject, updateProject } from "@/lib/actions/project.actions";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Category, ProjectFormValues } from "@/types";

import { insertProjectSchema } from "@/lib/validations/projectsValidations";
import FileUploader from "../FileUploader";

type ProjectFormProps = {
  onClose: () => void;
  type: "create" | "edit";
  initialData?: ProjectFormValues & { id?: string };

  categories: Category[];
};

function ProjectForm({
  onClose,
  type,
  initialData,
  categories,
}: ProjectFormProps) {
  const {
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
    register,
    // setValue,
    // getValues,
  } = useForm<ProjectFormValues>({
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

  const onSubmit = async (values: ProjectFormValues) => {
    try {
      const result =
        type === "create"
          ? await createProject(values)
          : initialData?.id
            ? await updateProject(initialData.id, values)
            : null;

      if (!result) {
        showErrorToast("شناسه پروژه برای ویرایش موجود نیست", "bottom-right");
        return;
      }

      if (result.success) {
        showSuccessToast(
          `پروژه با موفقیت ${type === "create" ? "ایجاد" : "ویرایش"} شد`,
          "bottom-right",
        );
        reset();
        onClose();
      } else {
        showErrorToast("خطا در ذخیره پروژه", "bottom-right");
      }
    } catch (error) {
      console.log(error);
      showErrorToast("مشکلی در پردازش رخ داد", "bottom-right");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="title">عنوان پروژه</Label>
        <Input id="title" {...register("title")} disabled={isSubmitting} />
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
          disabled={isSubmitting}
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
          disabled={isSubmitting}
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
        <FileUploader
          label="آپلود تصاویر"
          folderName="projects"
          accept="image/*"
          multiple
          onUploaded={(files) => {
            console.log("آپلود شده‌ها:", files);
          }}
        />
      </div>

      <div className="space-y-2">
        <FileUploader
          label="آپلود ویدیو"
          folderName="projects"
          accept="video/*"
          multiple
          onUploaded={(files) => {
            console.log("آپلود شده‌ها:", files);
          }}
        />
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="mt-4 w-full cursor-pointer rounded-full"
      >
        {isSubmitting
          ? "در حال ذخیره..."
          : type === "create"
            ? "ایجاد پروژه"
            : "ذخیره تغییرات"}
      </Button>
    </form>
  );
}

export default ProjectForm;
