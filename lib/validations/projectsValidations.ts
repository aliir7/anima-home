import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { projects } from "@/db/schema/projects";
import { isUUID } from "./helpersValidations";

const youtubeAparatRegex =
  /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be|aparat\.com)\/.+$/;

// SELECT
const baseSelectProjectSchema = createSelectSchema(projects).extend({
  images: z.array(z.string()),
  videos: z.array(z.string()).optional(),
  seoSlug: z.string().optional(),
});
export const selectProjectSchema = baseSelectProjectSchema;

// INSERT (ایجاد)
const baseInsertProjectSchema = createInsertSchema(projects, {
  title: z.string().min(3, "عنوان باید حداقل ۳ حرف باشد."),
  description: z.string().min(10, "توضیحات کافی نیست.").optional(),
  seoSlug: z
    .string()
    .min(3, "لینک سئو باید حداقل ۳ کاراکتر باشد.")
    .max(100, "لینک سئو خیلی طولانی است.")
    .regex(/^[a-z0-9-]+$/, "فقط حروف انگلیسی کوچک، عدد و خط تیره مجاز است"),
  images: z
    .array(z.string().min(1, "لینک تصویر معتبر نیست"))
    .min(1, "حداقل یک تصویر وارد کنید."),
  videos: z
    .array(
      z
        .string()
        .min(1, "لینک ویدیو معتبر نیست")
        .refine(
          (val) =>
            val.startsWith("https://anima-home.storage.c2.liara.space/") ||
            youtubeAparatRegex.test(val),
          "فقط لینک یوتیوب، آپارات یا فایل آپلود شده معتبر است",
        ),
    )
    .optional(),
  categoryId: isUUID("دسته‌بندی معتبر نیست."),
});
export const insertProjectSchema = baseInsertProjectSchema.omit({
  slug: true,
  createdAt: true,
});

// UPDATE (ویرایش) — همه فیلدها اختیاری و **بدون id**
export const updateProjectSchema = baseInsertProjectSchema
  .omit({ slug: true, createdAt: true })
  .partial();
