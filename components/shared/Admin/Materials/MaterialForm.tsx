"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertMaterialSchema } from "@/lib/validations/materialsValidations";
import {
  createMaterial,
  updateMaterial,
} from "@/lib/actions/materials.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MaterialFormValues } from "@/types";
import FileUploader from "../FileUploader";
import { Label } from "@/components/ui/label";
import { showErrorToast, showSuccessToast } from "@/lib/utils/showToastMessage";

type MaterialFormProps = {
  onClose: () => void;
  type: "create" | "edit";
  initialData?: MaterialFormValues & { id: string };
};

export default function MaterialForm({
  onClose,
  type,
  initialData,
}: MaterialFormProps) {
  const {
    handleSubmit,
    formState: { isSubmitting, errors },
    setValue,
    register,
    reset,
  } = useForm<MaterialFormValues>({
    resolver: zodResolver(insertMaterialSchema),
    mode: "onBlur",
    defaultValues: {
      title: initialData?.title ?? "",
      description: initialData?.description ?? "",
      image: initialData?.image ?? "",
      pdfUrl: initialData?.pdfUrl ?? "",
    },
  });

  const onSubmit = async (values: MaterialFormValues) => {
    const result =
      type === "create"
        ? await createMaterial(values)
        : initialData?.id
          ? await updateMaterial(values, initialData.id)
          : null;

    if (!result) {
      showErrorToast("خطا در ذخیره متریال", "bottom-right");
      return;
    }

    if (result.success) {
      showSuccessToast(
        `متریال با موفقیت ${type === "create" ? "ایجاد" : "ویرایش"}`,
        "bottom-right",
      );
      reset();
      onClose();
    } else if (result.error.type === "custom") {
      showErrorToast(
        "خطا: " + (result.error.message || "عملیات ناموفق بود"),
        "bottom-right",
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 px-4 py-2">
      {/* عنوان */}
      <div className="space-y-2">
        <Label htmlFor="title">عنوان متریال</Label>
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
      <div className="space-y-2">
        <FileUploader
          label="آپلود تصویر"
          folderName="materials/images"
          accept="image/*"
          onUploaded={(files) => setValue("image", files[0].url)}
        />
      </div>

      <div className="space-y-2">
        <FileUploader
          label="آپلود PDF"
          folderName="materials/pdfs"
          accept="application/pdf"
          onUploaded={(files) => setValue("pdfUrl", files[0].url)}
        />
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
            ? "ایجاد متریال"
            : "ذخیره تغییرات"}
      </Button>
    </form>
  );
}
