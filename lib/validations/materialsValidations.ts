// lib/validations/materialsValidations.ts
import { z } from "zod/v4";
import { isURL } from "./helpersValidations";

export const insertMaterialSchema = z.object({
  title: z.string().min(2, "عنوان باید حداقل ۲ کاراکتر باشد"),
  description: z.string().optional(),
  image: isURL("لینک عکس معتبر نیست").optional(),
  pdfUrl: isURL("لینک PDF معتبر نیست"),
});
