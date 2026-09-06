import {
  categoryWithParentSchema,
  insertCategorySchema,
  selectCategorySchema,
  updateCategorySchema,
} from "@/lib/validations/categoryValidations";
import z from "zod";

export type Category = z.infer<typeof selectCategorySchema>;
export type CategoryWithParent = z.infer<typeof categoryWithParentSchema>;
export type InsertCategoryValues = z.infer<typeof insertCategorySchema>;
export type UpdateCategoryValues = z.infer<typeof updateCategorySchema>;
