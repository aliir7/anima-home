"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import FileUploader from "@/components/shared/Admin/FileUploader";
import { showErrorToast, showSuccessToast } from "@/lib/utils/showToastMessage";
import { Plus, Trash2, X, Image as ImageIcon, Globe } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { createProductValues, ProductWithRelations } from "@/types";
import {
  createProductSchema,
  updateProductSchema,
} from "@/lib/validations/productValidation";
import {
  createProductAction,
  updateProductAction,
} from "@/lib/actions/product.actions";
import { getSafeImageSrc } from "@/lib/utils/urlUtils";

type Category = { id: string; name: string };

type ProductFormProps = {
  type: "Create" | "Update";
  categories: Category[];
  product?: ProductWithRelations | null;
  productId?: string;
};

export default function ProductForm({
  type,
  categories,
  product,
  productId,
}: ProductFormProps) {
  const router = useRouter();
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);

  // normalize image
  const normalizeImages = (images: unknown): string[] => {
    if (!Array.isArray(images)) return [];

    return images.filter(
      (img): img is string => typeof img === "string" && img.trim().length > 0,
    );
  };

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<createProductValues>({
    resolver: zodResolver(
      type === "Create" ? createProductSchema : updateProductSchema,
    ) as any,
    defaultValues: (() => {
      if (!product) {
        return {
          title: "",
          brand: "",
          seoSlug: "",
          categoryId: "",
          description: "",
          shortDescription: "",
          metaTitle: "",
          metaDescription: "",
          isIndexable: true,
          isActive: true,
          price: 0,
          discountPercent: 0,
          stock: 0,
          sku: "",
          specs: [],
          images: [],
        } as createProductValues;
      }

      const primaryVariant =
        product.variants && product.variants.length > 0
          ? product.variants[0]
          : null;

      return {
        title: product.title ?? "",
        brand: product.brand ?? "",
        seoSlug: product.seoSlug ?? "",
        categoryId: product.categoryId ?? product.category?.id ?? "",
        description: product.description ?? "",
        shortDescription: product.shortDescription ?? "",
        metaTitle: product.metaTitle ?? "",
        metaDescription: product.metaDescription ?? "",
        isIndexable: product.isIndexable ?? true,
        isActive: product.isActive ?? true,
        price: primaryVariant?.price ?? 0,
        discountPercent: 0,
        stock: primaryVariant?.stock ?? 0,
        sku: primaryVariant?.sku ?? "",
        specs: primaryVariant
          ? Object.entries(primaryVariant.specs || {}).map(([key, value]) => ({
              key,
              value,
            }))
          : [],
        images: normalizeImages(primaryVariant?.images) ?? [],
      } as createProductValues;
    })(),
  });

  useEffect(() => {
    if (!product) return;

    const primaryVariant = product.variants?.[0] || null;

    reset({
      title: product.title ?? "",
      brand: product.brand ?? "",
      seoSlug: product.seoSlug ?? "",
      categoryId: product.categoryId ?? product.category?.id ?? "",
      description: product.description ?? "",
      shortDescription: product.shortDescription ?? "",
      metaTitle: product.metaTitle ?? "",
      metaDescription: product.metaDescription ?? "",
      isIndexable: product.isIndexable ?? true,
      isActive: product.isActive ?? true,
      price: primaryVariant?.price ?? 0,
      discountPercent: 0,
      stock: primaryVariant?.stock ?? 0,
      sku: primaryVariant?.sku ?? "",
      specs: primaryVariant
        ? Object.entries(primaryVariant.specs || {}).map(([key, value]) => ({
            key,
            value,
          }))
        : [],
      images: normalizeImages(primaryVariant?.images) ?? [],
    });
  }, [product, reset]);

  const e = errors as any;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "specs",
  });

  const currentImages = watch("images") || [];
  const watchTitle = watch("title");
  const watchSeoSlug = watch("seoSlug");
  const watchMetaTitle = watch("metaTitle");
  const watchMetaDescription = watch("metaDescription");
  const watchShortDescription = watch("shortDescription");

  const handleUploadSuccess = (
    uploadedFiles: { url: string; key: string }[],
  ) => {
    const newUrls = uploadedFiles.map((file) => file.url);
    setValue("images", [...currentImages, ...newUrls], {
      shouldValidate: true,
    });
  };

  const removeImageFromGallery = (indexToRemove: number) => {
    const filtered = currentImages.filter((_, idx) => idx !== indexToRemove);
    setValue("images", filtered, { shouldValidate: true });
  };

  const onSubmit = async (data: createProductValues) => {
    setIsFormSubmitting(true);

    try {
      if (type === "Create") {
        const createPayload = {
          ...data,
          images: Array.isArray(data.images)
            ? data.images.filter(
                (img): img is string =>
                  typeof img === "string" && img.trim().length > 0,
              )
            : [],
        };

        const result = await createProductAction(createPayload);

        if (result.success) {
          showSuccessToast(result.message || "محصول ثبت شد", "bottom-right");
          reset();
          router.push("/admin/products");
        } else {
          showErrorToast(result.message as string, "bottom-right");
        }

        return;
      }

      if (!productId) {
        router.push("/admin/products");
        return;
      }

      const updatePayload = {
        ...data,
        images: Array.isArray(data.images)
          ? data.images.filter(
              (img): img is string =>
                typeof img === "string" && img.trim().length > 0,
            )
          : [],
      };

      const result = await updateProductAction(productId, updatePayload as any);

      if (result.success) {
        showSuccessToast(
          result.message || "محصول بروزرسانی شد",
          "bottom-right",
        );
        router.push("/admin/products");
      } else {
        showErrorToast(result.message as string, "bottom-right");
      }
    } finally {
      setIsFormSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit, (errs) =>
        console.log("validation errors:", errs),
      )}
      className="dark:bg-muted space-y-8 rounded-xl border bg-white p-6 shadow-sm dark:text-neutral-50"
    >
      <div className="border-b pb-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-neutral-50">
          {type === "Create" ? "افزودن محصول جدید" : "ویرایش محصول"}
        </h2>
        <p className="text-muted-foreground mt-2 text-sm dark:text-neutral-200">
          اطلاعات محصول را با دقت وارد کنید.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">
              نام محصول <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              {...register("title")}
              placeholder="مثلا: هود مخفی پودنیس H235"
              className="outline-light dark:outline-dark rounded-full dark:placeholder:text-neutral-300"
            />
            {errors.title && (
              <p className="text-destructive text-xs">{errors.title.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="brand">
                برند <span className="text-red-500">*</span>
              </Label>
              <Input
                id="brand"
                {...register("brand")}
                placeholder="مثلا: Podenis"
                className="outline-light dark:outline-dark rounded-full dark:placeholder:text-neutral-300"
              />
              {errors.brand && (
                <p className="text-destructive text-xs">
                  {errors.brand.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="categoryId">
                دسته‌بندی <span className="text-red-500">*</span>
              </Label>
              <select
                {...register("categoryId")}
                className="border-input bg-background dark:bg-muted focus-visible:ring-ring flex h-10 w-full rounded-full border px-4 py-2 text-sm focus-visible:ring-2 focus-visible:outline-none dark:text-neutral-300"
              >
                <option value="">انتخاب کنید...</option>
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
            <Label htmlFor="seo_slug">
              اسلاگ (URL) <span className="text-red-500">*</span>
            </Label>
            <Input
              id="seo_slug"
              {...register("seoSlug")}
              placeholder="podenis-hood-h235"
              className="outline-light dark:outline-dark rounded-full dark:placeholder:text-neutral-300"
              dir="ltr"
            />
            {errors.seoSlug && (
              <p className="text-destructive text-xs">
                {errors.seoSlug.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">
              توضیحات <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              {...register("description")}
              rows={4}
              className="outline-light dark:outline-dark dark:placeholder:text-neutral-300"
              placeholder="توضیحات کامل محصول را وارد کنید..."
            />
            {errors.description && (
              <p className="text-destructive text-xs">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="shortDescription">توضیحات کوتاه</Label>
              <span
                className={`text-[12px] ${(watchShortDescription?.length || 0) > 300 ? "text-orange-500" : "text-neutral-400"}`}
              >
                {watchShortDescription?.length || 0} / 300
              </span>
            </div>
            <Textarea
              id="shortDescription"
              {...register("shortDescription")}
              rows={3}
              placeholder="خلاصه‌ای کوتاه برای نمایش در کارت محصول یا معرفی سریع..."
              className="outline-light dark:outline-dark resize-none dark:placeholder:text-neutral-300"
            />
            <div className="h-1 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
              <div
                className={`h-full transition-all duration-500 ${
                  (watchShortDescription?.length || 0) > 300
                    ? "bg-orange-500"
                    : (watchShortDescription?.length || 0) > 220
                      ? "bg-green-500"
                      : "bg-yellow-500"
                }`}
                style={{
                  width: `${Math.min(((watchShortDescription?.length || 0) / 300) * 100, 100)}%`,
                }}
              />
            </div>
            {errors.shortDescription && (
              <p className="text-destructive text-xs">
                {errors.shortDescription.message}
              </p>
            )}
          </div>

          <div className="space-y-4 rounded-lg border bg-neutral-50 p-4 dark:bg-neutral-700">
            <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-50">
              اطلاعات انبار و قیمت
            </h3>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sku" className="text-xs md:text-sm">
                  SKU (کد)
                </Label>
                <Input
                  id="sku"
                  {...register("sku")}
                  placeholder="H235-B"
                  dir="ltr"
                  className="text-xs md:text-sm"
                />
                {errors.sku && (
                  <p className="text-destructive text-xs">
                    {errors.sku.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="price" className="text-xs md:text-sm">
                  قیمت (تومان)
                </Label>
                <Input
                  type="number"
                  className="text-xs md:text-sm"
                  id="price"
                  {...(register("price", { valueAsNumber: true }) as any)}
                />
                {errors.price && (
                  <p className="text-destructive text-xs">
                    {errors.price.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="stock" className="text-xs md:text-sm">
                  موجودی
                </Label>
                <Input
                  type="number"
                  id="stock"
                  className="text-xs md:text-sm"
                  {...(register("stock", { valueAsNumber: true }) as any)}
                />
                {errors.stock && (
                  <p className="text-destructive text-xs">
                    {errors.stock.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="discountPercent" className="text-xs md:text-sm">
                  درصد تخفیف
                </Label>
                <Input
                  type="number"
                  className="text-xs md:text-sm"
                  id="discountPercent"
                  {...(register("discountPercent", {
                    valueAsNumber: true,
                  }) as any)}
                />
                {errors.discountPercent && (
                  <p className="text-destructive text-xs">
                    {errors.discountPercent.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg border border-dashed bg-white/50 p-3 dark:bg-black/20">
              <input
                type="checkbox"
                id="isActive"
                {...register("isActive")}
                className="h-4 w-4 cursor-pointer rounded accent-green-600 transition-all"
              />
              <div className="grid gap-1.5 leading-none">
                <Label
                  htmlFor="isActive"
                  className="cursor-pointer text-xs font-semibold"
                >
                  فعال بودن محصول
                </Label>
                <p className="text-muted-foreground text-[10px]">
                  اگر غیرفعال باشد، محصول در سایت نمایش داده نمی‌شود.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-6 rounded-xl border bg-neutral-50 p-6 dark:bg-blue-900/10">
            <div className="flex items-center gap-2 border-b pb-3">
              <div className="flex-center gap-2">
                <Globe className="text-blue-600" size={20} />
                <h3 className="text-sm font-bold text-blue-900 dark:text-blue-100">
                  تنظیمات سئو
                </h3>
              </div>
            </div>

            <div className="space-y-2 rounded-lg border bg-white p-4 shadow-sm dark:bg-neutral-800">
              <span className="text-[10px] font-medium tracking-wider text-neutral-500 uppercase">
                پیش‌نمایش در نتایج گوگل
              </span>
              <div className="max-w-full space-y-1 overflow-hidden">
                <div className="cursor-pointer truncate font-sans text-[17px] leading-tight text-[#1a0dab] hover:underline dark:text-blue-400">
                  {watchMetaTitle || watchTitle || "عنوان محصول در اینجا..."}
                </div>
                <div className="truncate font-sans text-[13px] text-[#006621] dark:text-green-500">
                  {`https://anima-home.com/products/${watchSeoSlug || "slug"}`}
                </div>
                <div className="line-clamp-2 font-sans text-[12px] leading-relaxed text-[#4d5156] dark:text-neutral-400">
                  {watchMetaDescription ||
                    "لطفا توضیحات متا را وارد کنید تا پیش‌نمایش گوگل تکمیل شود. در صورت خالی بودن، گوگل بخشی از متن را نمایش می‌دهد."}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="metaTitle" className="text-xs">
                    عنوان سئو (Meta Title)
                    <span className="text-red-500">*</span>
                  </Label>
                  <span
                    className={`text-[12px] ${(watchMetaTitle?.length || 0) > 60 ? "text-orange-500" : "text-neutral-400"}`}
                  >
                    {watchMetaTitle?.length || 0} / 60
                  </span>
                </div>
                <Input
                  id="metaTitle"
                  {...register("metaTitle")}
                  placeholder="مثلا: خرید و قیمت هود پودنیس مدل H235"
                  className="h-9 rounded-full bg-white text-sm placeholder:p-1 placeholder:text-xs dark:bg-neutral-900"
                />
                <div className="h-1 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
                  <div
                    className={`h-full transition-all duration-500 ${
                      (watchMetaTitle?.length || 0) > 60
                        ? "bg-orange-500"
                        : (watchMetaTitle?.length || 0) > 45
                          ? "bg-green-500"
                          : "bg-yellow-500"
                    }`}
                    style={{
                      width: `${Math.min(((watchMetaTitle?.length || 0) / 60) * 100, 100)}%`,
                    }}
                  />
                </div>
                {errors.metaTitle && (
                  <p className="text-destructive text-xs">
                    {errors.metaTitle.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="metaDescription" className="text-xs">
                    توضیحات متا (Meta Description)
                    <span className="text-red-500">*</span>
                  </Label>
                  <span
                    className={`text-[12px] ${(watchMetaDescription?.length || 0) > 155 ? "text-orange-500" : "text-neutral-400"}`}
                  >
                    {watchMetaDescription?.length || 0} / 155
                  </span>
                </div>
                <Textarea
                  id="metaDescription"
                  {...register("metaDescription")}
                  placeholder="توضیحات کوتاهی که در گوگل نمایش داده می‌شود..."
                  className="resize-none rounded-xl bg-white text-sm placeholder:p-1 placeholder:text-xs dark:bg-neutral-900"
                  rows={3}
                />
                <div className="h-1 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
                  <div
                    className={`h-full transition-all duration-500 ${
                      (watchMetaDescription?.length || 0) > 155
                        ? "bg-orange-500"
                        : (watchMetaDescription?.length || 0) > 120
                          ? "bg-green-500"
                          : "bg-yellow-500"
                    }`}
                    style={{
                      width: `${Math.min(((watchMetaDescription?.length || 0) / 155) * 100, 100)}%`,
                    }}
                  />
                </div>
                {errors.metaDescription && (
                  <p className="text-destructive text-xs">
                    {errors.metaDescription.message}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3 rounded-lg border border-dashed bg-white/50 p-3 dark:bg-black/20">
                <input
                  type="checkbox"
                  id="isIndexable"
                  {...register("isIndexable")}
                  className="h-4 w-4 cursor-pointer rounded accent-blue-600 transition-all"
                />
                <div className="grid gap-1.5 leading-none">
                  <Label
                    htmlFor="isIndexable"
                    className="cursor-pointer text-xs font-semibold"
                  >
                    نمایش در نتایج جستجو (Indexable)
                  </Label>
                  <p className="text-muted-foreground text-[10px]">
                    اگر غیرفعال باشد، این صفحه به موتورهای جستجو معرفی نمی‌شود.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="dark:bg-muted space-y-4 rounded-lg border bg-gray-50 p-4">
            <h3 className="flex items-center gap-2 text-sm font-semibold">
              <ImageIcon size={18} /> تصاویر محصول
            </h3>

            <FileUploader
              label="آپلود تصاویر (چندگانه)"
              folderName="products"
              accept="image/*"
              multiple={true}
              onUploaded={handleUploadSuccess}
            />

            {errors.images && (
              <p className="text-destructive text-xs">
                {errors.images.message}
              </p>
            )}

            {currentImages.length > 0 ? (
              <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
                {currentImages.map((url, index) => (
                  <div
                    key={index}
                    className="group relative aspect-square overflow-hidden rounded-full border bg-white shadow-sm"
                  >
                    <Image
                      src={getSafeImageSrc(url)}
                      alt={`prod-${index}`}
                      fill
                      sizes="(max-width: 640px) 33vw, 25vw"
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
              <p className="text-muted-foreground rounded-full border-2 border-dashed py-4 text-center text-xs">
                هنوز تصویری اضافه نشده است
              </p>
            )}
          </div>

          <div className="dark:bg-muted space-y-4 rounded-lg border bg-neutral-50 p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-50">
                مشخصات فنی
              </h3>
              <Button
                type="button"
                onClick={() => append({ key: "", value: "" })}
                variant="outline"
                size="sm"
                className="h-8 rounded-full text-xs"
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
                      {...(register(`specs.${index}.key`) as any)}
                      placeholder="عنوان (مثلا: موتور)"
                      className="h-9 rounded-full bg-white text-sm"
                    />
                    {e.specs?.[index]?.key && (
                      <span className="text-destructive text-[10px]">
                        {e.specs[index]?.key?.message}
                      </span>
                    )}
                  </div>

                  <div className="flex-1">
                    <Input
                      {...(register(`specs.${index}.value`) as any)}
                      placeholder="مقدار (مثلا: توربو)"
                      className="h-9 rounded-full bg-white text-sm"
                    />
                    {e.specs?.[index]?.value && (
                      <span className="text-destructive text-[10px]">
                        {e.specs[index]?.value?.message}
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

      <div className="flex justify-end border-t pt-4">
        <Button
          type="submit"
          disabled={isFormSubmitting}
          className="w-full cursor-pointer rounded-full px-4 py-2 font-medium disabled:cursor-none md:w-48 md:text-sm"
        >
          {isFormSubmitting
            ? "در حال پردازش..."
            : type === "Create"
              ? "ثبت محصول"
              : "بروزرسانی محصول"}
        </Button>
      </div>
    </form>
  );
}
