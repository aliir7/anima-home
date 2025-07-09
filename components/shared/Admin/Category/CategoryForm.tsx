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
  categories: { id: string; name: string }[];
};

function CategoryForm({
  onClose,
  type,
  initialData,
  categories,
}: CategoryFormProps) {
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
      } else if (action.error.type === "custom") {
        showErrorToast(
          "خطا: " + (action.error.message || "عملیات ناموفق بود"),
          "bottom-right",
        );
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="name">نام دسته‌بندی</Label>
        <Input
          id="name"
          {...register("name")}
          disabled={pending || isSubmitting}
        />
        {errors.name && (
          <p className="text-destructive mt-1 text-sm">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="parentId">دسته‌بندی والد (اختیاری)</Label>
        <select
          id="parentId"
          {...register("parentId")}
          className="w-full rounded-md border p-2"
          disabled={pending || isSubmitting}
        >
          <option value="">بدون والد</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <Button
        type="submit"
        disabled={pending || isSubmitting}
        className="w-full rounded-full"
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
