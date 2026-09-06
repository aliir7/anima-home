import { shippingAddressSchema } from "@/lib/validations/orderValidations";
import { mobileSchema, otpSchema } from "@/lib/validations/smsValidations";
import {
  changePasswordSchema,
  contactFormSchema,
  forgotPasswordSchema,
  signinSchema,
  signupFormSchema,
  signupSchema,
  userSchema,
} from "@/lib/validations/usersValidations";
import z from "zod";

// USER LIST (admin panel)
export type UsersListItem = {
  id: string;
  name: string | null;
  email: string | null;
  phoneNumber: string | null;
  role: "user" | "admin";
  emailVerified: boolean;
  createdAt: Date | null;
};

export type UsersPaginatedData = {
  usersList: UsersListItem[];
  totalPages: number;
};

export type UserSchema = z.infer<typeof userSchema>;
export type SignupFormValues = z.infer<typeof signupFormSchema>;
export type SignupInsert = z.infer<typeof signupSchema>;
export type SigninValues = z.infer<typeof signinSchema>;
export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;
export type ChangePasswordValues = z.infer<typeof changePasswordSchema>;
// contact form type
export type ContactFormValues = z.infer<typeof contactFormSchema>;
// shipping address type
export type ShippingAddress = z.infer<typeof shippingAddressSchema>;

export type MobileValues = z.infer<typeof mobileSchema>;
export type OtpValues = z.infer<typeof otpSchema>;
