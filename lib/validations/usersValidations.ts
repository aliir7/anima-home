import { z } from "zod/v4"; // استفاده از zod معمولی به جای zod/v4 برای پایداری

// ✅ signinSchema صریح و امن
export const signinSchema = z.object({
  email: z.email("ایمیل معتبر وارد کنید"),
  password: z.string().min(1, "رمز عبور الزامی است"),
});

// بقیه اسکیمای شما بدون تغییر
export const signupSchema = z.object({
  name: z.string().min(3, "نام باید حداقل ۳ کاراکتر باشد"),
  email: z.email("ایمیل نامعتبر است"),
  password: z.string().min(6, "رمز عبور باید حداقل ۶ کاراکتر باشد").max(50),
});

export const signupFormSchema = signupSchema
  .extend({
    confirmPassword: z
      .string()
      .min(6, "تکرار رمز عبور باید حداقل ۶ کاراکتر باشد"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "رمز عبور و تکرار آن مطابقت ندارند",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: z.email("ایمیل معتبر وارد کنید"),
});

export const changePasswordSchema = z
  .object({
    password: z.string().min(6, "رمز عبور باید حداقل ۶ کاراکتر باشد").max(50),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "رمز عبور و تکرار آن باید برابر باشند",
    path: ["confirmPassword"],
  });

export const contactFormSchema = z.object({
  name: z.string().min(3, { message: "نام باید حداقل 3 کاراکتر باشد" }),
  email: z.email({ message: "لطفاً یک ایمیل معتبر وارد کنید" }),
  subject: z.string().optional(),
  message: z.string().min(10, { message: "پیام باید حداقل ۱۰ کاراکتر باشد" }),
});
