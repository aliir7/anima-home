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

import { useForm } from "react-hook-form";

type CategoryFormProps = {
  onClose: () => void;
  type: "create" | "edit";
  initialData?: InsertCategoryValues & { id?: string };
};

function CategoryForm({ onClose, type, initialData }: CategoryFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<InsertCategoryValues>({
    resolver: zodResolver(insertCategorySchema),
    defaultValues: initialData ?? {
      name: "",
      parentId: undefined,
      parentName: "",
    },
  });

  // submit handler
  const onSubmit = async (values: InsertCategoryValues) => {
    // اگر parentName وارد شده بود، مقدار parentId را حذف کن تا فقط parentName ارسال شود
    const submitValues = { ...values };
    if (submitValues.parentName && submitValues.parentName.trim() !== "") {
      submitValues.parentId = undefined;
    }
    const action =
      type === "create"
        ? await createCategoryAction(submitValues)
        : initialData?.id
          ? await updateCategoryAction({ ...submitValues, id: initialData.id })
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
    } else if (action.error.type === "custom") {
      showErrorToast(
        "خطا: " + (action.error.message || "عملیات ناموفق بود"),
        "bottom-right",
      );
    }
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
          disabled={isSubmitting}
          className="rounded-full"
        />
        {errors.name && (
          <p className="text-destructive mt-1 text-sm">{errors.name.message}</p>
        )}
      </div>

      {/* حذف فیلد parentId از فرم */}

      <div className="mt-6 mr-2 mb-4 space-y-4">
        <Label htmlFor="parentName" className="mr-2 pt-2">
          نام والد (اختیاری، اگر والد جدید است)
        </Label>
        <Input
          id="parentName"
          placeholder="مثلاً: کابینت یا جا کفشی"
          {...register("parentName")}
          className="rounded-full"
          disabled={isSubmitting}
        />
        {errors.parentName && (
          <p className="text-destructive mt-1 mr-2 text-sm">
            {errors.parentName.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 mb-4 w-full rounded-full"
      >
        {isSubmitting
          ? "در حال ذخیره..."
          : type === "create"
            ? "ایجاد دسته‌بندی"
            : "ذخیره تغییرات"}
      </Button>
    </form>
  );
}

export default CategoryForm;
