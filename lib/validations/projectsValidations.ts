import { createInsertSchema } from "drizzle-zod";
import { projects } from "@/db/schema/projects";
import { z } from "zod";

export const projectSchema = createInsertSchema(projects, {
  title: z.string().min(3, "عنوان الزامی است"),
  slug: z.string().min(3, "این فیلد الزامی است"),
  description: z.string().min(5, "توضیحات الزامی است"),
  categoryId: z.string().min(1, "دسته‌بندی الزامی است"),
  images: z.array(z.string().url({ message: "لینک تصویر معتبر نیست" })),
  videos: z
    .array(z.string().url({ message: "لینک ویدیو معتبر نیست" }))
    .optional(),
});

export type ProjectInsert = z.infer<typeof projectSchema>;

export const updateProjectSchema = projectSchema.partial().extend({
  id: projectSchema.shape.id,
});

export type UpdateProjectSchema = z.infer<typeof updateProjectSchema>;
