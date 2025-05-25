import { users } from "@/db/schema";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// ساخت اسکیمای اصلی از جدول users
export const signupSchema = createInsertSchema(users, {
  name: z.string().min(3, "نام باید حداقل ۳ کاراکتر باشد"),
  email: z.string().email("ایمیل نامعتبر است"),
  password: z.string().min(6, "رمز عبور باید حداقل ۶ کاراکتر باشد"),
});

// اسکیمایی که توی فرم استفاده می‌کنیم و confirmPassword داره
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

// اسکیمای signin فقط شامل ایمیل و پسورد
export const signinSchema = createInsertSchema(users).pick({
  email: true,
  password: true,
});

export const userSchema = createInsertSchema(users).pick({
  name: true,
  email: true,
  image: true,
});
