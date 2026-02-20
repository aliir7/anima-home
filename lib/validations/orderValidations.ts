import { z } from "zod/v4";
import { PAYMENT_METHODS } from "../constants";
import { isURL } from "./helpersValidations";

// ==========================================
// Schema for the shipping address (آدرس ارسال)
// ==========================================
export const shippingAddressSchema = z.object({
  fullName: z.string().min(3, "نام گیرنده باید حداقل ۳ کاراکتر باشد"),
  streetAddress: z.string().min(10, "آدرس پستی باید حداقل ۱۰ کاراکتر باشد"),
  city: z.string().min(2, "نام شهر معتبر نیست"),
  phone: z
    .string()
    .regex(/^09\d{9}$/, "شماره موبایل گیرنده معتبر نیست (مثال: 09123456789)"),
  postalCode: z
    .string()
    .regex(/^\d{10}$/, "کد پستی باید دقیقاً ۱۰ رقم و فقط شامل اعداد باشد"),

  country: z.string().default("ایران"),
  lat: z.number().optional(),
  lng: z.number().optional(),
});

// ==========================================
// Schema for payment method (روش پرداخت)
// ==========================================
export const paymentMethodSchema = z
  .object({
    type: z.string().min(1, "انتخاب روش پرداخت الزامی است"),
  })
  .refine((data) => PAYMENT_METHODS.includes(data.type), {
    path: ["type"],
    message: "روش پرداخت انتخاب شده معتبر نیست",
  });

// ==========================================
// Schema for inserting order (ثبت سفارش)
// ==========================================
export const insertOrderSchema = z.object({
  userId: z.string().min(1, "شناسه کاربر الزامی است"),
  itemsPrice: z.number().int().nonnegative("قیمت هر آیتم باید عددی مثبت باشد"),
  totalPrice: z.number().int().nonnegative("قیمت نهایی باید عددی مثبت باشد"),
  taxPrice: z.number().int().nonnegative("مالیات باید عددی مثبت باشد"),
  shippingPrice: z.number().optional(),
  paymentMethod: z
    .string()
    .refine((data) => PAYMENT_METHODS.includes(data as any), {
      message: "روش پرداخت انتخاب شده معتبر نیست",
    }),
  shippingAddress: shippingAddressSchema,
});

// ==========================================
// Schema for inserting an order item (آیتم‌های سفارش)
// ==========================================
export const insertOrderItemSchema = z.object({
  productId: z.string().min(1, "شناسه محصول الزامی است"),
  slug: z.string().min(1, "شناسه لینک (Slug) الزامی است"),
  image: isURL("آدرس تصویر معتبر نیست"),
  name: z.string().min(1, "نام محصول الزامی است"),
  price: z.number().int().nonnegative("قیمت باید عددی مثبت باشد"),
  qty: z.coerce.number().int().min(1, "تعداد باید حداقل ۱ باشد"),
});

// ==========================================
// Schema for the Zibal paymentResult (نتیجه پرداخت زیبال)
// ==========================================
export const paymentResultSchema = z.object({
  // کد پیگیری یکتای زیبال (trackId) که از سمت زیبال برمی‌گردد
  trackId: z.union([z.string(), z.number()], {
    message: "کد پیگیری زیبال (trackId) الزامی است",
  }),

  // وضعیت یا نتیجه تراکنش (status در callback و result در verify معمولاً عدد هستند)
  // زیبال کد 100 را برای موفقیت و کدهای دیگر را برای خطا برمی‌گرداند
  status: z.union([z.string(), z.number()], {
    message: "وضعیت تراکنش مشخص نیست",
  }),

  // شماره مرجع تراکنش بانکی (پس از verify موفق داده می‌شود)
  refNumber: z.union([z.string(), z.number()]).optional(),

  // شماره کارت ماسک شده (مانند 621986******1234)
  cardNumber: z.string().optional(),

  // شناسه سفارش پذیرنده (اختیاری - orderId که شما به زیبال فرستادید)
  orderId: z.union([z.string(), z.number()]).optional(),

  // مبلغ تایید شده تراکنش (اختیاری جهت تطبیق مضاعف)
  amount: z.number().optional(),

  // تاریخ و زمان پرداخت
  paidAt: z.string().optional(),
});
