import { productSchema } from "@/db/schema/product";
import {
  signinSchema,
  signupFormSchema,
  signupSchema,
} from "@/lib/validations/usersValidations";
import { z } from "zod";

export type ProductSchema = z.infer<typeof productSchema>;

export type SignupFormValues = z.infer<typeof signupFormSchema>;
export type SignupInsert = z.infer<typeof signupSchema>;
export type SigninValues = z.infer<typeof signinSchema>;
