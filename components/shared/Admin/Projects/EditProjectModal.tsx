"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { updateProject } from "@/lib/actions/project.actions";
import { getProjectById } from "@/db/queries/projectQueries";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateProjectSchema } from "@/lib/validations/projectsValidations";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { UpdateProjectValues } from "@/types/index";
import { showErrorToast, showSuccessToast } from "@/lib/utils/showToastMessage";

type EditProjectModalProps = {
  projectId: string | null;
  onClose: () => void;
};
function EditProjectModal({ projectId, onClose }: EditProjectModalProps) {
  const [loading, setLoading] = useState(false);
  const [defaultValues, setDefaultValues] =
    useState<UpdateProjectValues | null>(null);

  const form = useForm<UpdateProjectValues>({
    resolver: zodResolver(updateProjectSchema),
    defaultValues,
  });

  useEffect(() => {
    if (projectId) {
      setLoading(true);
      getProjectById(projectId).then((data) => {
        setDefaultValues({
          title: data.title,
          description: data.description ?? "",
          categoryId: data.categoryId,
        });
        form.reset({
          title: data.title,
          description: data.description ?? "",
          categoryId: data.categoryId,
        });
        setLoading(false);
      });
    }
  }, [projectId]);

  const onSubmit = async (values: UpdateProjectValues) => {
    if (!projectId) return;

    const result = await updateProject(projectId, values);

    if (result.success) {
      showSuccessToast("پروژه با موفقیت ویرایش شد", "bottom-right");
      onClose();
    } else {
      showErrorToast(
        result.error?.message || "خطا در بروزرسانی پروژه",
        "bottom-right",
      );
    }
  };

  return (
    <Dialog open={!!projectId} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>ویرایش پروژه</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="py-10 text-center">در حال بارگذاری...</div>
        ) : (
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <Input
              placeholder="عنوان پروژه"
              {...form.register("title")}
              disabled={form.formState.isSubmitting}
            />
            <Textarea
              placeholder="توضیحات"
              {...form.register("description")}
              disabled={form.formState.isSubmitting}
            />
            <Input
              placeholder="ID دسته‌بندی"
              {...form.register("categoryId")}
              disabled={form.formState.isSubmitting}
            />
            <div className="flex justify-end">
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting
                  ? "در حال ذخیره..."
                  : "ذخیره تغییرات"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default EditProjectModal;
