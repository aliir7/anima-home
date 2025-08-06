import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { projects } from "@/db/schema/projects";
import { isUUID } from "./helpersValidations";

// Create base schemas from Drizzle-zod
const baseSelectProjectSchema = createSelectSchema(projects);

// for select full schema
export const selectProjectSchema = baseSelectProjectSchema;
const baseInsertProjectSchema = createInsertSchema(projects, {
  title: z.string().min(3, "عنوان باید حداقل ۳ حرف باشد."),
  description: z.string().min(10, "توضیحات کافی نیست.").optional(),
  images: z
    .array(z.string().min(1, "لینک تصویر معتبر نیست"))
    .min(1, "حداقل یک تصویر وارد کنید."),

  videos: z.array(z.string().min(1, "لینک ویدیو معتبر نیست")).optional(),
  categoryId: isUUID("دسته‌بندی معتبر نیست."),
});

export const insertProjectSchema = baseInsertProjectSchema.omit({
  slug: true,
  createdAt: true,
});

// برای ویرایش (update) — فقط id اجباری
export const updateProjectSchema = baseInsertProjectSchema.omit({
  slug: true,
  createdAt: true,
});
