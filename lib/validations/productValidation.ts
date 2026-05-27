import z from "zod/v4";
import { isURL, isUUID, slugSchema } from "./helpersValidations";

export const createProductSchema = z.object({
  // --- مربوط به جدول products ---
  title: z.string().min(3, "عنوان باید حداقل ۳ کاراکتر باشد"),
  brand: z.string().min(2, "برند الزامی است"),

  seoSlug: slugSchema,
  categoryId: isUUID("لطفا یک دسته‌بندی معتبر انتخاب کنید"),
  description: z.string().trim().optional(),
  metaTitle: z
    .string()
    .trim()
    .min(3, "متا تایتل خیلی کوتاه است")
    .max(70, "متا تایتل بهتر است حداکثر ۷۰ کاراکتر باشد")
    .optional(),

  metaDescription: z
    .string()
    .trim()
    .min(10, "متا دیسکریپشن خیلی کوتاه است")
    .max(160, "متا دیسکریپشن بهتر است حداکثر ۱۶۰ کاراکتر باشد")
    .optional(),

  shortDescription: z
    .string()
    .trim()
    .max(300, "توضیح کوتاه بهتر است حداکثر ۳۰۰ کاراکتر باشد")
    .optional(),

  isIndexable: z.coerce.boolean().optional().default(true),

  // --- مربوط به جدول product_variants ---
  sku: z.string().min(1, "کد کالا (SKU) الزامی است"),

  // استفاده از coerce برای تبدیل رشته ورودی فرم به عدد
  price: z.coerce
    .number()
    .int("قیمت باید عدد صحیح باشد")
    .nonnegative("قیمت نمیتواند عدد منفی باشد")
    .min(1000, "قیمت نامعتبر است"),
  discountPercent: z.coerce
    .number()
    .int("قیمت باید عدد صحیح باشد")
    .nonnegative("قیمت نمیتواند عدد منفی باشد")
    .optional()
    .default(0),

  stock: z.coerce
    .number()
    .int()
    .nonnegative()
    .min(0, "موجودی نمی‌تواند منفی باشد"),

  // مدیریت ویژگی‌های فنی در فرم (آرایه) که بعدا به آبجکت تبدیل می‌شود
  specs: z
    .array(
      z.object({
        key: z.string().min(1, "عنوان ویژگی الزامی است"),
        value: z.string().min(1, "مقدار ویژگی الزامی است"),
      }),
    )
    .default([]),

  // تصاویر
  images: z.array(isURL("لینک تصاویر معتبر نیست")).default([]),
});

// Schema for updating products (without id since it's passed separately)
export const updateProductSchema = createProductSchema.partial();
