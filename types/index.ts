import { productSchema } from "@/db/schema/product";
import {
  signinSchema,
  signupFormSchema,
  signupSchema,
} from "@/lib/validations/usersValidations";
import { z, ZodIssue } from "zod";

export type ProductSchema = z.infer<typeof productSchema>;

export type ActionError =
  | { type: "zod"; issues: ZodIssue[] }
  | { type: "custom"; message: string };
export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: ActionError };

export type SignupFormValues = z.infer<typeof signupFormSchema>;
export type SignupInsert = z.infer<typeof signupSchema>;
export type SigninValues = z.infer<typeof signinSchema>;
