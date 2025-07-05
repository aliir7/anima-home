import { createInsertSchema } from "drizzle-zod";
import { projects } from "@/db/schema/projects";
import { z } from "zod";

// Full schema for insert

export const insertProjectSchema = createInsertSchema(projects, {
  title: z.string().min(3, "عنوان باید حداقل ۳ حرف باشد."),
  description: z.string().min(10, "توضیحات کافی نیست.").optional(),
  images: z
    .array(z.string().url({ message: "لینک تصویر معتبر نیست" }))
    .min(1, "حداقل یک تصویر وارد کنید."),
  videos: z
    .array(z.string().url({ message: "لینک ویدیو معتبر نیست" }))
    .optional(),
});
// Partial schema for update
export const updateProjectSchema = insertProjectSchema.partial().extend({
  id: insertProjectSchema.shape.id,
});
