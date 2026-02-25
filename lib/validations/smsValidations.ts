import { z } from "zod";

// ... existing schemas ...

export const mobileSchema = z.object({
  mobile: z
    .string()
    .min(1, "شماره موبایل الزامی است")
    .regex(/^09\d{9}$/, "شماره موبایل معتبر نیست (مثال: 09123456789)"),
});

export const otpSchema = z.object({
  mobile: z.string(),
  code: z.string().length(6, "کد تایید باید 6 رقم باشد"), // طبق عکس شما کد ۵ رقمی معمول است، اگر ۴ یا ۶ است تغییر دهید
});
