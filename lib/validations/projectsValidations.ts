import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { projects } from "@/db/schema";

// helpers
const isUUID = (message = "شناسه معتبر نیست.") =>
  z
    .string()
    .refine(
      (val) =>
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(
          val,
        ),
      { message },
    );

const isURL = (message = "لینک معتبر نیست.") =>
  z.string().refine(
    (val) => {
      try {
        new URL(val);
        return true;
      } catch {
        return false;
      }
    },
    { message },
  );

// فقط برای نمایش پروژه‌ها
export const selectProjectSchema = createSelectSchema(projects);

// برای ایجاد پروژه (از طریق فرم)
export const rawProjectSchema = createInsertSchema(projects, {
  title: z.string().min(3, "عنوان باید حداقل ۳ حرف باشد."),
  description: z.string().min(10, "توضیحات کافی نیست.").optional(),
  images: z
    .array(isURL("لینک تصویر معتبر نیست"))
    .min(1, "حداقل یک تصویر وارد کنید."),
  videos: z.array(isURL("لینک ویدیو معتبر نیست")).optional(),
  categoryId: isUUID("دسته‌بندی معتبر نیست."),
});

export const insertProjectSchema = rawProjectSchema.transform((val) => val);

// برای ویرایش (update) — فقط id اجباری
export const updateProjectSchema = rawProjectSchema.partial().extend({
  id: rawProjectSchema.shape.id,
});
