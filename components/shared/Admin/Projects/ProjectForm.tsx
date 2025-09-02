"use client";

import type { FieldArrayPath } from "react-hook-form";
import { useState } from "react";
import type { Resolver } from "react-hook-form";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { PlusCircle, Trash2 } from "lucide-react";

import {
  insertProjectSchema,
  // از validations برگرفته شده (videos?: string[])
} from "@/lib/validations/projectsValidations";
import { showErrorToast, showSuccessToast } from "@/lib/utils/showToastMessage";
import { createProject, updateProject } from "@/lib/actions/project.actions";

import FileUploader from "../FileUploader";
import { Category, ProjectFormValues } from "@/types";

/**
 * راه‌حل: برای RHF یه تایپ محلی می‌سازیم که videos حتماً آرایه باشد.
 * این تایپ فقط داخل کامپوننت استفاده می‌شود تا useFieldArray بدون خطا باشد.
 */
type RHFProjectFormValues = Omit<ProjectFormValues, "videos"> & {
  videos: string[];
};

type ProjectFormProps = {
  onClose: () => void;
  type: "create" | "edit";
  initialData?: ProjectFormValues & { id?: string };
  categories: Category[];
};

// هماهنگ‌سازی زاد-ریزابر (resolver) با تایپ داخلی فرم
const rhfResolver = zodResolver(
  insertProjectSchema,
) as unknown as Resolver<RHFProjectFormValues>;

export default function ProjectForm({
  onClose,
  type,
  initialData,
  categories,
}: ProjectFormProps) {
  const [useVideoUpload, setUseVideoUpload] = useState(true);

  const {
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
    register,
    setValue,
    getValues,
    control,
  } = useForm<RHFProjectFormValues>({
    resolver: rhfResolver,
    mode: "onBlur",
    defaultValues: {
      title: initialData?.title ?? "",
      description: initialData?.description ?? "",
      categoryId: initialData?.categoryId ?? "",
      images: initialData?.images ?? [],
      // همیشه آرایه — حتی اگر در اسکیما optional باشه
      videos: initialData?.videos ?? [],
    },
  });

  const { fields, append, remove } = useFieldArray<
    RHFProjectFormValues,
    FieldArrayPath<RHFProjectFormValues>
  >({
    control,
    name: "videos" as FieldArrayPath<RHFProjectFormValues>,
  });

  const handleUploadMedia = (
    files: { url: string; key: string }[],
    field: "images" | "videos",
  ) => {
    const current = getValues(field) ?? [];
    const newFiles = files.map((f) => f.url);
    setValue(field, [...current, ...newFiles], {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const onSubmit = async (values: RHFProjectFormValues) => {
    try {
      // values سازگار با ProjectFormValues هست چون videos: string[] جایگزین videos?: string[] میشه
      const payload: ProjectFormValues = values;
      const result =
        type === "create"
          ? await createProject(payload)
          : initialData?.id
            ? await updateProject(initialData.id, payload)
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
        const resultErrorMsg =
          result.error.type === "custom" ? result.error.message : "";
        showErrorToast("خطا در ذخیره پروژه", "bottom-right", resultErrorMsg);
      }
    } catch (error) {
      console.error(error);
      showErrorToast("مشکلی در پردازش رخ داد", "bottom-right");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 px-4 py-2">
      {/* عنوان */}
      <div className="space-y-2">
        <Label htmlFor="title">عنوان پروژه</Label>
        <Input id="title" {...register("title")} disabled={isSubmitting} />
        {errors.title && (
          <p className="text-destructive mt-2">{errors.title.message}</p>
        )}
      </div>

      {/* توضیحات */}
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

      {/* لینک سئو */}
      <div className="space-y-2">
        <Label htmlFor="seoSlug">لینک سئو</Label>
        <Input
          id="seoSlug"
          {...register("seoSlug")}
          disabled={isSubmitting}
          placeholder="مثال: modern-villa-design"
        />
        {errors.seoSlug && (
          <p className="text-destructive mt-2">{errors.seoSlug.message}</p>
        )}
      </div>

      {/* دسته‌بندی */}
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

      {/* تصاویر */}
      <div className="space-y-2">
        <FileUploader
          label="آپلود تصاویر"
          folderName="projects"
          accept="image/*"
          multiple
          onUploaded={(files) => handleUploadMedia(files, "images")}
        />
      </div>

      {/* ویدیوها */}
      <div className="space-y-2">
        <Label htmlFor="videos">ویدیوها</Label>

        <div className="mr-2 mb-2 flex items-center gap-4">
          <Switch
            checked={useVideoUpload}
            onCheckedChange={setUseVideoUpload}
            className="bg-muted data-[state=checked]:bg-primary rounded-full"
            id="video-switch"
          />
          <span>{useVideoUpload ? "آپلود فایل" : "لینک ویدیو"}</span>
        </div>

        {useVideoUpload ? (
          <FileUploader
            label="آپلود ویدیو"
            folderName="projects"
            accept="video/*"
            multiple
            onUploaded={(files) => handleUploadMedia(files, "videos")}
          />
        ) : (
          <div className="space-y-2">
            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-2">
                {/* cast to const to satisfy RHF template typing */}
                <Input
                  {...register(`videos.${index}` as const)}
                  placeholder={`لینک ویدیو ${index + 1}`}
                />
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => remove(index)}
                  size="icon"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="secondary"
              onClick={() => append({})}
              className="flex items-center gap-2"
            >
              <PlusCircle className="h-4 w-4" />
              افزودن لینک جدید
            </Button>
          </div>
        )}
      </div>

      {/* دکمه ذخیره */}
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
