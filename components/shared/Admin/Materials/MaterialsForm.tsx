"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertMaterialSchema } from "@/lib/validations/materialsValidations";
import { createMaterial } from "@/lib/actions/materials.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MaterialFormValues } from "@/types";
import FileUploader from "../FileUploader";

export default function MaterialForm() {
  const form = useForm<MaterialFormValues>({
    resolver: zodResolver(insertMaterialSchema),
    defaultValues: {
      title: "",
      description: "",
      image: "",
      pdfUrl: "",
    },
  });

  const onSubmit = async (values: MaterialFormValues) => {
    await createMaterial(values);
    form.reset();
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <Input placeholder="عنوان" {...form.register("title")} />
      <Textarea placeholder="توضیحات" {...form.register("description")} />

      <FileUploader
        label="آپلود تصویر"
        folderName="materials/images"
        accept="image/*"
        onUploaded={(files) => form.setValue("image", files[0].url)}
      />

      <FileUploader
        label="آپلود PDF"
        folderName="materials/pdfs"
        accept="application/pdf"
        onUploaded={(files) => form.setValue("pdfUrl", files[0].url)}
      />

      <Button type="submit" className="w-full">
        ذخیره
      </Button>
    </form>
  );
}
