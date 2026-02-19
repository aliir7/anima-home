import { productCategories, products, productVariants } from "@/db/schema";
import {
  cartItemSchema,
  insertCartSchema,
} from "@/lib/validations/cartValidations";
import {
  categoryWithParentSchema,
  insertCategorySchema,
  selectCategorySchema,
  updateCategorySchema,
} from "@/lib/validations/categoryValidations";
import {
  insertMaterialSchema,
  selectMaterialSchema,
  updateMaterialSchema,
} from "@/lib/validations/materialsValidations";
import {
  createProductSchema,
  updateProductSchema,
} from "@/lib/validations/productValidation";
import {
  insertProjectSchema,
  selectProjectSchema,
  updateProjectSchema,
} from "@/lib/validations/projectsValidations";
import {
  changePasswordSchema,
  contactFormSchema,
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

export type VerifyEmailResult =
  | { success: true; message: string }
  | { success: false; message: string };
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

// materials types
export type Material = z.infer<typeof selectMaterialSchema>;
export type MaterialFormValues = z.infer<typeof insertMaterialSchema>;
export type UpdateMaterialValues = z.infer<typeof updateMaterialSchema>;

// product types
export type createProductValues = z.infer<typeof createProductSchema>;
export type updateProductValues = z.infer<typeof updateProductSchema>;

export type ProductVariant = typeof productVariants.$inferSelect & {
  specs: Record<string, string>;
  images: string[];
};

export type ProductWithRelations = typeof products.$inferSelect & {
  category: typeof productCategories.$inferSelect | null;
  variants: ProductVariant[];
};
export type ProductCategoryWithParent =
  typeof productCategories.$inferSelect & {
    parent: typeof productCategories.$inferSelect | null;
  };
// تایپ خروجی نهایی: تمام فیلدهای محصول + یک آرایه از واریانت‌ها + آبجکت دسته بندی
export type ProductSpec = {
  label: string;
  value: string;
};

// contact form type
export type ContactFormValues = z.infer<typeof contactFormSchema>;

// cart types
export type Cart = z.infer<typeof insertCartSchema>;
export type CartItem = z.infer<typeof cartItemSchema>;

export type ShopItem = {
  category: {
    id: string;
    title: string;
  };
  product: {
    id: string;
    title: string;
    rating: number;
    numReviews: number;
    createdAt: string;
  };
  variant: {
    id: string;
    title: string;
    price: number;
    images: string[];
    stock: number;
  };
};
