import {
  insertMaterialSchema,
  selectMaterialSchema,
  updateMaterialSchema,
} from "@/lib/validations/materialsValidations";
import z from "zod";

export type Material = z.infer<typeof selectMaterialSchema>;
export type MaterialFormValues = z.infer<typeof insertMaterialSchema>;
export type UpdateMaterialValues = z.infer<typeof updateMaterialSchema>;
