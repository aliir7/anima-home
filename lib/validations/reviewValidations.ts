import { z } from "zod";

export const createReviewSchema = z.object({
  productId: z.uuid("شناسه محصول نامعتبر است"),
  rating: z
    .number()
    .int("امتیاز باید عدد صحیح باشد")
    .min(1, "امتیاز باید حداقل ۱ باشد")
    .max(5, "امتیاز باید حداکثر ۵ باشد"),
  comment: z
    .string()
    .trim()
    .max(1000, "نظر نباید بیشتر از ۱۰۰۰ کاراکتر باشد")
    .optional(),
});
