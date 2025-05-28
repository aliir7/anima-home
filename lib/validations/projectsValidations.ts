import { createInsertSchema } from "drizzle-zod";
import { projects } from "@/db/schema/projects";
import { z } from "zod";

// Full schema for insert
export const insertProjectSchema = createInsertSchema(projects, {
  title: z.string().min(5, "عنوان الزامی است"),
  description: z.string().optional(),
  images: z
    .array(z.string().url("آدرس تصویر معتبر نیست"))
    .min(1, "حداقل یک تصویر نیاز است"),
  videos: z
    .array(z.string().url("آدرس ویدیو معتبر نیست"))
    .optional()
    .default([]),
});

// Partial schema for update
export const updateProjectSchema = insertProjectSchema.partial();
