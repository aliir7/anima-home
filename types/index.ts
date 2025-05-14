import { productSchema } from "@/db/schema/product";
import { z } from "zod";

export type ProductSchema = z.infer<typeof productSchema>;
