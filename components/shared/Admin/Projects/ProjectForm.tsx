"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { showErrorToast, showSuccessToast } from "@/lib/utils/showToastMessage";
import { createProject, updateProject } from "@/lib/actions/project.actions";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertProjectSchema } from "@/lib/validations/projectsValidations";
import { InsertProjectValues } from "@/types";
import { getAllCategories } from "@/db/queries/categoriesQueries";

type ProjectFormProps = {
  onClose: () => void;
  type: "create" | "edit";
  initialData?: InsertProjectValues;
};

function ProjectForm({ onClose, type, initialData }: ProjectFormProps) {
  const [pending, startTransition] = useTransition();
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    [],
  );

  const form = useForm<InsertProjectValues>({
    resolver: zodResolver(insertProjectSchema),
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
      const result =
        type === "create"
          ? await createProject(values)
          : await updateProject(initialData!.id, values);

      if (result.success) {
        showSuccessToast(
          `پروژه با موفقیت ${type === "create" ? "ایجاد" : "ویرایش"} شد`,
          "bottom-right",
        );
        form.reset();
        onClose();
      } else {
        showErrorToast("خطا در ذخیره پروژه", "bottom-right");
      }
    });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <Label>عنوان پروژه</Label>
        <Input {...form.register("title")} disabled={pending} />
      </div>

      <div>
        <Label>توضیحات</Label>
        <Textarea
          {...form.register("description")}
          rows={3}
          disabled={pending}
        />
      </div>

      <div>
        <Label>دسته‌بندی</Label>
        <select
          {...form.register("categoryId")}
          disabled={pending}
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

      <div>
        <Label>تصاویر (JSON)</Label>
        <Textarea
          {...form.register("images")}
          placeholder='["image1.jpg", "image2.jpg"]'
          rows={2}
          disabled={pending}
        />
      </div>

      <div>
        <Label>ویدیوها (JSON - اختیاری)</Label>
        <Textarea
          {...form.register("videos")}
          placeholder='["video1.mp4"]'
          rows={2}
          disabled={pending}
        />
      </div>

      <Button type="submit" disabled={pending} className="w-full rounded-full">
        {pending
          ? "در حال ذخیره..."
          : type === "create"
            ? "ایجاد پروژه"
            : "ذخیره تغییرات"}
      </Button>
    </form>
  );
}

export default ProjectForm;
