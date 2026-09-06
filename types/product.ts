import { productCategories, products, productVariants } from "@/db/schema";
import {
  createProductSchema,
  updateProductSchema,
} from "@/lib/validations/productValidation";
import z from "zod";

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

export type Product = z.infer<typeof createProductSchema> & {
  id: string;
  rating: string;
  numReviews: number;
  createdAt: Date;
};
// تایپ خروجی نهایی: تمام فیلدهای محصول + یک آرایه از واریانت‌ها + آبجکت دسته بندی
export type ProductSpec = {
  label: string;
  value: string;
};
