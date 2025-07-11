import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { categories } from "@/db/schema/categories";

//for insert
export const insertCategorySchema = z.object({
  name: z.string().min(2, "نام دسته‌بندی باید حداقل ۲ حرف باشد."),
  parentId: z
    .string()
    .min(2, "مقدار والد باید حداقل ۲ حرف باشد.")
    .optional()
    .or(z.literal("")), // برای خالی گذاشتن فیلد
  parentName: z.string().optional(), // اعتبارسنجی نام والد
});

// for select
export const selectCategorySchema = createSelectSchema(categories);

// for add parent
export const categoryWithParentSchema = selectCategorySchema.extend({
  parent: selectCategorySchema.optional().nullable(), // یا فقط name اگر فقط همینه
});

// for update
export const updateCategorySchema = insertCategorySchema.extend({
  id: z.string().uuid({ message: "شناسه نامعتبر است." }),
});
