// lib/validations/materialsValidations.ts
import { z } from "zod/v4";
import { isURL } from "./helpersValidations";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { materials } from "@/db/schema";

// for select
export const selectMaterialSchema = createSelectSchema(materials);

// for create
export const insertMaterialSchema = createInsertSchema(materials, {
  title: z.string().min(2, "عنوان باید حداقل ۲ کاراکتر باشد"),
  description: z.string().optional(),
  image: isURL("لینک عکس معتبر نیست").optional(),
  pdfUrl: isURL("لینک PDF معتبر نیست"),
});

// for update
export const updateMaterialSchema = insertMaterialSchema.partial();
