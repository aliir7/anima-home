import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { categories } from "@/db/schema/categories";

// 👇 اسکیمای insert برای استفاده در فرم و سرور
export const insertCategorySchema = createInsertSchema(categories, {
  name: z.string().min(2, "نام دسته‌بندی حداقل باید ۲ حرف باشد"),
  slug: z
    .string()
    .min(2, "اسلاگ باید حداقل ۲ کاراکتر باشد")
    .regex(/^[a-z0-9-]+$/, "فقط حروف کوچک، عدد و خط فاصله مجاز است"),
  parentId: z.string().uuid().optional().nullable(), // برای دسته‌های اصلی null هست
});

// 👇 اسکیمای select (مثلاً برای نمایش یا ویرایش)
export const selectCategorySchema = createSelectSchema(categories);
