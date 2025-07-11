import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { categories } from "@/db/schema/categories";

//for insert
export const insertCategorySchema = createInsertSchema(categories, {
  name: z.string().min(3, "نام دسته‌بندی حداقل باید 3 حرف باشد"),
  parentId: z.string().optional().nullable(), // برای دسته‌های اصلی null هست
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
