import z from "zod/v4";
import { isURL, isUUID } from "./helpersValidations";

export const createProductSchema = z.object({
  // --- مربوط به جدول products ---
  title: z.string().min(3, "عنوان باید حداقل ۳ کاراکتر باشد"),
  brand: z.string().min(2, "برند الزامی است"),

  seoSlug: z
    .string()
    .min(3, "اسلاگ الزامی است")
    .regex(/^[a-z0-9-]+$/, "فقط حروف انگلیسی کوچک، اعداد و خط تیره مجاز است"),
  categoryId: isUUID("لطفا یک دسته‌بندی معتبر انتخاب کنید"),
  description: z.string().optional(),

  // --- مربوط به جدول product_variants ---
  sku: z.string().min(1, "کد کالا (SKU) الزامی است"),

  // استفاده از coerce برای تبدیل رشته ورودی فرم به عدد
  price: z.coerce
    .number()
    .int("قیمت باید عدد صحیح باشد")
    .nonnegative("قیمت نمیتواند عدد منفی باشد")
    .min(1000, "قیمت نامعتبر است"),

  stock: z.coerce
    .number()
    .int()
    .nonnegative()
    .min(1, "موجودی نمی‌تواند منفی باشد"),

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
