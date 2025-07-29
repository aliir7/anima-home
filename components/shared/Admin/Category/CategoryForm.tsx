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
import { CategoryWithParent, InsertCategoryValues } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import CategoryCombobox from "./CategoryComboBox";

type CategoryFormProps = {
  onClose: () => void;
  type: "create" | "edit";
  initialData?: InsertCategoryValues & { id?: string };
  existingCategories?: CategoryWithParent[];
};

function CategoryForm({
  onClose,
  type,
  initialData,
  existingCategories = [],
}: CategoryFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm<InsertCategoryValues>({
    resolver: zodResolver(insertCategorySchema),
    defaultValues: initialData ?? {
      name: "",
      parentName: "",
    },
  });

  const parentName = watch("parentName");
  const name = watch("name");
  const description = parentName
    ? `دسته بندی با نام ${name} و سرگروه ${parentName}`
    : `دسته بندی با نام ${name}`;

  const onSubmit = async (values: InsertCategoryValues) => {
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
        `${description} با موفقیت ${type === "create" ? "ایجاد" : "ویرایش"}شد `,
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
      {/* نام دسته‌بندی */}
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

      {/* کمبوباکس یا input برای والد */}
      <div className="mt-6 mr-2 mb-4 space-y-4">
        <Label htmlFor="parentName" className="mr-2">
          دسته‌بندی والد (اختیاری)
        </Label>
        <CategoryCombobox
          categories={existingCategories}
          value={parentName || ""}
          onChange={(val) => {
            setValue("parentName", val, { shouldValidate: true });
          }}
        />
        {errors.parentName && (
          <p className="text-destructive mt-1 mr-2 text-sm">
            {errors.parentName.message}
          </p>
        )}
      </div>

      {/* دکمه */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="mt-14 mb-4 w-full rounded-full"
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
