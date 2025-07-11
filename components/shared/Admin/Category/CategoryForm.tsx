"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  createCategoryAction,
  updateCategoryAction,
} from "@/lib/actions/category.actions";
import { showErrorToast, showSuccessToast } from "@/lib/utils/showToastMessage";
import { insertCategorySchema } from "@/lib/validations/categoryValidations";
import { InsertCategoryValues } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm } from "react-hook-form";

type CategoryFormProps = {
  onClose: () => void;
  type: "create" | "edit";
  initialData?: InsertCategoryValues & { id?: string };
};

function CategoryForm({ onClose, type, initialData }: CategoryFormProps) {
  const [pending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<InsertCategoryValues>({
    resolver: zodResolver(insertCategorySchema),

    defaultValues: initialData ?? { name: "", parentId: undefined },
  });

  // submit handler
  const onSubmit = (values: InsertCategoryValues) => {
    startTransition(async () => {
      const action =
        type === "create"
          ? await createCategoryAction(values)
          : initialData?.id
            ? await updateCategoryAction({ ...values, id: initialData.id })
            : null;

      if (!action) {
        showErrorToast("خطا در ذخیره دسته‌بندی", "bottom-right");
        return;
      }

      if (action.success) {
        showSuccessToast(
          `دسته‌بندی با موفقیت ${type === "create" ? "ایجاد" : "ویرایش"} شد`,
          "bottom-right",
        );
        reset();
        onClose();
      }
      if (!action.success && action.error.type === "custom") {
        showErrorToast(action.error.message, "bottom-right");
      }
      if (!action.success && action.error.type === "zod") {
        showErrorToast("خطا در اعتبارسنجی داده‌ها", "bottom-right");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="mt-2 mr-2 mb-4 space-y-4">
        <Label htmlFor="name" className="mr-2">
          نام دسته‌بندی
        </Label>
        <Input
          id="name"
          {...register("name")}
          disabled={pending || isSubmitting}
          className="rounded-full"
        />
        {errors.name && (
          <p className="text-destructive mt-1 text-sm">{errors.name.message}</p>
        )}
      </div>

      <div className="mt-6 mr-2 mb-4 space-y-4">
        <Label htmlFor="parentId" className="mr-2 pt-2">
          درنظر گرفتن سرگروه برای دسته بندی (اختیاری)
        </Label>

        <Input
          id="parentId"
          placeholder="مثلاً: کابینت یا جا کفشی"
          {...register("parentId")}
          className="rounded-full"
          disabled={pending || isSubmitting}
        />
        {errors.parentId && (
          <p className="text-destructive mt-1 mr-2 text-sm">
            {errors.parentId.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        disabled={pending || isSubmitting}
        className="mt-6 mb-4 w-full rounded-full"
      >
        {pending || isSubmitting
          ? "در حال ذخیره..."
          : type === "create"
            ? "ایجاد دسته‌بندی"
            : "ذخیره تغییرات"}
      </Button>
    </form>
  );
}

export default CategoryForm;
