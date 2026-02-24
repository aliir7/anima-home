"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
// فایل آپلودر شما
import FileUploader from "@/components/shared/Admin/FileUploader";
import { showErrorToast, showSuccessToast } from "@/lib/utils/showToastMessage";
import { Plus, Trash2, X, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createProductValues, ProductWithRelations } from "@/types";
import { createProductSchema } from "@/lib/validations/productValidation";
import { createProductAction } from "@/lib/actions/product.actions";

type ProductFormProps = {
  categories: { id: string; name: string }[];
  product?: ProductWithRelations;
  productId?: string;
  type: "Create" | "Update";
};

export default function ProductForm({ categories }: ProductFormProps) {
  const router = useRouter();

  // استیت برای مدیریت وضعیت سابمیت کلی فرم

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<createProductValues>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      title: "",
      brand: "",
      seoSlug: "",
      categoryId: "",
      description: "",
      price: 0,
      stock: 0,
      sku: "",
      specs: [], // شروع با لیست خالی
      images: [],
    },
  });

  // مدیریت فیلدهای داینامیک (specs)
  const { fields, append, remove } = useFieldArray({
    control,
    name: "specs",
  });

  // مشاهده تصاویر برای نمایش در گالری
  const currentImages = watch("images");

  // هندلر سابمیت نهایی فرم
  const onSubmit = async (data: createProductValues) => {
    const result = await createProductAction(data);

    if (result.success) {
      showSuccessToast(result.message || "محصول ثبت شد", "bottom-right");
      reset();
      router.push("/admin/products");
    } else {
      showErrorToast(result.message as string, "bottom-right");
    }
  };

  // --- مدیریت آپلودر ---
  // این تابع وقتی صدا زده می‌شود که آپلودر شما فایل‌ها را با موفقیت آپلود کرده باشد
  const handleUploadSuccess = (
    uploadedFiles: { url: string; key: string }[],
  ) => {
    const newUrls = uploadedFiles.map((f) => f.url);
    // اضافه کردن لینک‌های جدید به لیست موجود
    setValue("images", [...currentImages, ...newUrls], {
      shouldValidate: true,
    });
  };

  // حذف تصویر از لیست فرم (نه از سرور)
  const removeImageFromGallery = (indexToRemove: number) => {
    const filtered = currentImages.filter((_, idx) => idx !== indexToRemove);
    setValue("images", filtered, { shouldValidate: true });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8 rounded-xl border bg-white p-6 shadow-sm"
    >
      {/* هدر فرم */}
      <div className="border-b pb-4">
        <h2 className="text-xl font-bold text-gray-800">افزودن محصول جدید</h2>
        <p className="text-muted-foreground mt-2 text-sm">
          اطلاعات محصول را با دقت وارد کنید.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* ستون راست: اطلاعات متنی */}
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">
              نام محصول <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              {...register("title")}
              placeholder="مثلا: هود مخفی پودنیس H235"
            />
            {errors.title && (
              <p className="text-destructive text-xs">{errors.title.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="brand">برند</Label>
              <Input
                id="brand"
                {...register("brand")}
                placeholder="مثلا: Podenis"
              />
              {errors.brand && (
                <p className="text-destructive text-xs">
                  {errors.brand.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="categoryId">دسته‌بندی</Label>
              <select
                {...register("categoryId")}
                className="border-input bg-background focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:outline-none dark:bg-neutral-50 dark:text-neutral-800"
              >
                <option value="" className="">
                  انتخاب کنید...
                </option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && (
                <p className="text-destructive text-xs">
                  {errors.categoryId.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="seo_slug">اسلاگ (URL)</Label>
            <Input
              id="seo_slug"
              {...register("seoSlug")}
              placeholder="podenis-hood-h235"
              dir="ltr"
            />
            {errors.seoSlug && (
              <p className="text-destructive text-xs">
                {errors.seoSlug.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">توضیحات</Label>
            <Textarea id="description" {...register("description")} rows={4} />
          </div>

          {/* اطلاعات فروش */}
          <div className="space-y-4 rounded-lg border bg-gray-50 p-4">
            <h3 className="text-sm font-semibold text-gray-700">
              اطلاعات انبار و قیمت
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sku">SKU (کد)</Label>
                <Input
                  id="sku"
                  {...register("sku")}
                  placeholder="H235-B"
                  dir="ltr"
                />
                {errors.sku && (
                  <p className="text-destructive text-xs">
                    {errors.sku.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">قیمت (تومان)</Label>
                <Input type="number" id="price" {...register("price")} />
                {errors.price && (
                  <p className="text-destructive text-xs">
                    {errors.price.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">موجودی</Label>
                <Input type="number" id="stock" {...register("stock")} />
                {errors.stock && (
                  <p className="text-destructive text-xs">
                    {errors.stock.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ستون چپ: تصاویر و مشخصات فنی */}
        <div className="space-y-8">
          {/* بخش تصاویر */}
          <div className="space-y-4 rounded-lg border bg-gray-50 p-4">
            <h3 className="flex items-center gap-2 text-sm font-semibold">
              <ImageIcon size={18} /> تصاویر محصول
            </h3>

            {/* استفاده از کامپوننت آپلودر شما */}
            <FileUploader
              label="آپلود تصاویر (چندگانه)"
              folderName="products"
              accept="image/*"
              multiple={true} // فعال کردن قابلیت چند انتخابی
              onUploaded={handleUploadSuccess}
            />
            {errors.images && (
              <p className="text-destructive text-xs">
                {errors.images.message}
              </p>
            )}

            {/* گالری تصاویر انتخاب شده */}
            {currentImages.length > 0 ? (
              <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
                {currentImages.map((url, index) => (
                  <div
                    key={index}
                    className="group relative aspect-square overflow-hidden rounded-md border bg-white shadow-sm"
                  >
                    <Image
                      src={url}
                      alt={`prod-${index}`}
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImageFromGallery(index)}
                      className="absolute top-1 right-1 rounded-full bg-red-500/80 p-1 text-white opacity-0 transition-all group-hover:opacity-100 hover:bg-red-600"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground rounded-md border-2 border-dashed py-4 text-center text-xs">
                هنوز تصویری اضافه نشده است
              </p>
            )}
          </div>

          {/* بخش مشخصات فنی (Specs) */}
          <div className="space-y-4 rounded-lg border bg-gray-50 p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-700">
                مشخصات فنی
              </h3>
              <Button
                type="button"
                onClick={() => append({ key: "", value: "" })}
                variant="outline"
                size="sm"
                className="h-8 text-xs"
              >
                <Plus size={14} className="ml-1" /> افزودن سطر
              </Button>
            </div>

            <div className="custom-scrollbar max-h-75 space-y-2 overflow-y-auto pr-1">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="animate-in slide-in-from-top-2 flex items-start gap-2 duration-300"
                >
                  <div className="flex-1">
                    <Input
                      {...register(`specs.${index}.key`)}
                      placeholder="عنوان (مثلا: موتور)"
                      className="h-9 bg-white text-sm"
                    />
                    {errors.specs?.[index]?.key && (
                      <span className="text-destructive text-[10px]">
                        {errors.specs[index]?.key?.message}
                      </span>
                    )}
                  </div>

                  <div className="flex-1">
                    <Input
                      {...register(`specs.${index}.value`)}
                      placeholder="مقدار (مثلا: توربو)"
                      className="h-9 bg-white text-sm"
                    />
                    {errors.specs?.[index]?.value && (
                      <span className="text-destructive text-[10px]">
                        {errors.specs[index]?.value?.message}
                      </span>
                    )}
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive h-9 w-9 hover:bg-red-50"
                    onClick={() => remove(index)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              ))}

              {fields.length === 0 && (
                <div className="text-muted-foreground py-2 text-center text-xs">
                  مشخصاتی ثبت نشده. برای افزودن ویژگی جدید دکمه بالا را بزنید.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* دکمه ثبت نهایی */}
      <div className="flex justify-end border-t pt-4">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full cursor-pointer rounded-full px-4 py-6 text-sm font-medium disabled:cursor-none md:w-48 md:text-lg"
        >
          {isSubmitting ? "در حال پردازش..." : "ثبت محصول"}
        </Button>
      </div>
    </form>
  );
}
