import { productSchema } from "@/db/schema/product";
import {
  insertCategorySchema,
  selectCategorySchema,
} from "@/lib/validations/categoryValidations";
import {
  insertProjectSchema,
  selectProjectSchema,
  updateProjectSchema,
} from "@/lib/validations/projectsValidations";
import {
  signinSchema,
  signupFormSchema,
  signupSchema,
  userSchema,
} from "@/lib/validations/usersValidations";
import { z, ZodIssue } from "zod";

// database queries types
export type QueryResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

// server action results types
export type ActionError =
  | { type: "zod"; issues: ZodIssue[] }
  | { type: "custom"; message: string };
export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: ActionError };

// user types
export type UserSchema = z.infer<typeof userSchema>;
export type SignupFormValues = z.infer<typeof signupFormSchema>;
export type SignupInsert = z.infer<typeof signupSchema>;
export type SigninValues = z.infer<typeof signinSchema>;

// category types
export type InsertCategoryValues = z.infer<typeof insertCategorySchema>;
export type Category = z.infer<typeof selectCategorySchema>;

// project types
export type InsertProjectValues = z.infer<typeof insertProjectSchema>;
export type UpdateProjectValues = z.infer<typeof updateProjectSchema>;
export type Project = z.infer<typeof selectProjectSchema>;

// product types
export type ProductSchema = z.infer<typeof productSchema>;
