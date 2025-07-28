import {
  categoryWithParentSchema,
  insertCategorySchema,
  selectCategorySchema,
  updateCategorySchema,
} from "@/lib/validations/categoryValidations";
import {
  insertProjectSchema,
  selectProjectSchema,
  updateProjectSchema,
} from "@/lib/validations/projectsValidations";
import {
  changePasswordSchema,
  forgotPasswordSchema,
  signinSchema,
  signupFormSchema,
  signupSchema,
  userSchema,
} from "@/lib/validations/usersValidations";
import { z } from "zod/v4";

// database queries types
export type QueryResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

// server action results types
export type ActionError =
  | { type: "zod"; issues: z.ZodError["issues"] }
  | { type: "custom"; message: string };
export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: ActionError };

// user types
export type UserSchema = z.infer<typeof userSchema>;
export type SignupFormValues = z.infer<typeof signupFormSchema>;
export type SignupInsert = z.infer<typeof signupSchema>;
export type SigninValues = z.infer<typeof signinSchema>;
export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;
export type ChangePasswordValues = z.infer<typeof changePasswordSchema>;
// category types
export type Category = z.infer<typeof selectCategorySchema>;
export type CategoryWithParent = z.infer<typeof categoryWithParentSchema>;
export type InsertCategoryValues = z.infer<typeof insertCategorySchema>;
export type UpdateCategoryValues = z.infer<typeof updateCategorySchema>;

// project types
export type InsertProjectValues = z.infer<typeof insertProjectSchema>;
export type UpdateProjectValues = z.infer<typeof updateProjectSchema>;
export type Project = z.infer<typeof selectProjectSchema>;
export type ProjectFormValues = z.infer<typeof insertProjectSchema>;

export type ProjectWithCategory = Project & {
  category?: Category;
};

// product types
