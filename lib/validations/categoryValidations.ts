import { categories } from "@/db/schema";
import { z } from "zod";
import { createInsertSchema } from "drizzle-zod";

export const insertCategorySchema = createInsertSchema(categories, {
  name: z.string().min(3, "نام دسته‌بندی الزامی است"),
  slug: z.string().min(3, "اسلاگ الزامی است"),
});

export type InsertCategorySchema = z.infer<typeof insertCategorySchema>;
