"use server";

import { signIn } from "@/lib/auth"; // مسیر auth.ts خود را چک کنید
import { sendFastSms } from "@/lib/sms";
import { users } from "@/db/schema"; // تنظیمات جدول یوزر
import { eq } from "drizzle-orm";
import crypto from "crypto";
import { generateRandomNumber } from "../utils/generateRandomNumber";
import { db } from "@/db";

// ... existing actions ...

// 1. اکشن ارسال کد تایید
export async function sendOtpAction(mobile: string) {
  try {
    // تولید کد تصادفی 5 رقمی
    const otpCode = generateRandomNumber();
    const otpExpiresAt = new Date(Date.now() + 2 * 60 * 1000); // انقضا 2 دقیقه بعد

    // پیدا کردن کاربر یا ایجاد کاربر موقت (اگر ثبت نام نکرده باشد)
    const existingUser = await db.query.users.findFirst({
      where: eq(users.phone, mobile),
    });

    if (existingUser) {
      // آپدیت کد کاربر موجود
      await db
        .update(users)
        .set({ otp: otpCode, otpExpiresAt })
        .where(eq(users.id, existingUser.id));
    } else {
      // ایجاد کاربر جدید فقط با موبایل (ثبت نام سریع)
      // در auth.ts باید هندل شود که فیلدهای email می‌توانند null باشند
      await db.insert(users).values({
        phone: mobile,
        otp: otpCode,
        otpExpiresAt,
        role: "user",
        // ایمیل را فعلا نال یا یک مقدار موقت می‌گذاریم اگر دیتابیس اجبار دارد
      } as any);
    }

    // دریافت زمان جاری برای متغیر TIME در قالب پیامک
    const currentTime = new Date().toLocaleTimeString("fa-IR", {
      hour: "2-digit",
      minute: "2-digit",
    });

    // ارسال پیامک
    const smsResult = await sendFastSms({
      mobile,
      templateId: Number(process.env.NEXT_PUBLIC_OTP_TEMPLATE_ID),
      parameters: [
        { name: "VERIFICATIONCODE", value: otpCode },
        { name: "TIME", value: currentTime },
      ],
    });

    if (!smsResult || smsResult.status !== 1) {
      return {
        success: false,
        message: "خطا در ارسال پیامک. لطفاً مجدداً تلاش کنید.",
      };
    }

    return { success: true, message: "کد تایید ارسال شد" };
  } catch (error) {
    console.error("OTP Error:", error);
    return { success: false, message: "خطای سیستمی رخ داده است." };
  }
}

// 2. اکشن لاگین با OTP
export async function signinWithOtpAction(data: {
  mobile: string;
  code: string;
}) {
  try {
    // فراخوانی متد signIn مربوط به NextAuth با پروایدر 'otp' که قبلا ساختیم
    await signIn("otp", {
      phone: data.mobile,
      code: data.code,
      redirect: false, // ریدایرکت دستی در کلاینت انجام می‌شود
    });

    return { success: true };
  } catch (error) {
    if ((error as any).type === "CredentialsSignin") {
      return {
        success: false,
        error: { message: "کد وارد شده اشتباه یا منقضی شده است." },
      };
    }
    return { success: false, error: { message: "خطای ناشناخته رخ داد." } };
  }
}
