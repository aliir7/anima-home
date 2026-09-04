import { z } from "zod";

export const applyCouponSchema = z.object({
  code: z
    .string()
    .trim()
    .min(1, "کد تخفیف را وارد کنید")
    .max(50, "کد تخفیف نامعتبر است"),
});

export const createCouponSchema = z
  .object({
    code: z
      .string()
      .trim()
      .min(3, "کد باید حداقل ۳ کاراکتر باشد")
      .max(50, "کد نباید بیشتر از ۵۰ کاراکتر باشد")
      .transform((v) => v.toUpperCase()),
    type: z.enum(["percent", "fixed"]),
    value: z.number().int().positive("مقدار باید عددی مثبت باشد"),
    minOrderAmount: z.number().int().nonnegative().optional().nullable(),
    maxUses: z.number().int().positive().optional().nullable(),
    maxUsesPerUser: z.number().int().positive().optional().nullable(),
    expiresAt: z.coerce.date().optional().nullable(),
    isActive: z.boolean().default(true),
  })
  .refine(
    (data) => data.type !== "percent" || data.value <= 100,
    { message: "درصد تخفیف نمی‌تواند بیشتر از ۱۰۰ باشد", path: ["value"] },
  );

export const updateCouponSchema = createCouponSchema;
