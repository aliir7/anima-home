import { createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { categories } from "@/db/schema/categories";
import { isUUID } from "./helpersValidations";

//for insert

export const insertCategorySchema = z.object({
  name: z.string().min(2, "نام دسته‌بندی باید حداقل ۲ حرف باشد."),

  // فیلد parentName می‌تونه اختیاری باشه ولی اگه وارد شد باید حداقل ۲ حرف باشه
  parentName: z
    .string()
    .optional()
    .refine(
      (val) => !val || val.trim().length >= 2,
      "نام والد باید حداقل ۲ حرف باشد.",
    ),
});

// for select
export const selectCategorySchema = createSelectSchema(categories);

// for add parent
export const categoryWithParentSchema = selectCategorySchema.extend({
  parent: selectCategorySchema.optional().nullable(), // یا فقط name اگر فقط همینه
});

// for update
export const updateCategorySchema = insertCategorySchema.extend({
  id: isUUID("شناسه نامعتبر است"),
});
