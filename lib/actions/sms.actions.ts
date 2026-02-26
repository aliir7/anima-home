"use server";

import { signIn } from "@/lib/auth"; // مسیر auth.ts خود را چک کنید
import { sendFastSms } from "@/lib/sms";
import { users } from "@/db/schema"; // تنظیمات جدول یوزر
import { eq } from "drizzle-orm";
import crypto from "crypto";
import { generateRandomNumber } from "../utils/generateRandomNumber";
import { db } from "@/db";
import { Order, ShippingAddress } from "@/types";
import { getOrderById } from "./order.actions";
import {
  ADMIN_MOBILE_NUMBER,
  NEXT_PUBLIC_OTP_TEMPLATE_ID,
  ORDER_SUCCESS_ADMIN_TEMPLATE_ID,
  ORDER_SUCCESS_CLIENT_TEMPLATE_ID,
} from "../constants";

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
      templateId: Number(NEXT_PUBLIC_OTP_TEMPLATE_ID),
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

export async function sendOrderSuccessSmsToClient(id: string) {
  try {
    // get orderById
    const order = await getOrderById(id);

    if (!order) {
      console.error("Order SMS Skipped: Order not found");
      return;
    }

    const { fullName, phone } = order.shippingAddress as ShippingAddress;

    if (!phone || !fullName) {
      console.warn(
        "Order SMS Skipped: Missing phone or fullname in shipping address.",
      );
      return;
    }

    const orderId = order.refNumber ?? order?.id;
    const result = await sendFastSms({
      mobile: phone,
      templateId: Number(ORDER_SUCCESS_CLIENT_TEMPLATE_ID),
      parameters: [
        { name: "FULLNAME", value: fullName },
        { name: "ORDERID", value: orderId! },
      ],
    });

    if (!result) {
      console.error("SMS Provider Error: Failed to send order success SMS.");
    } else {
      console.log(`Order SMS sent to ${phone} for Order #${orderId}`);
    }
  } catch (err) {
    console.error("Internal Error sending order SMS:", err);
  }
}

export async function sendOrderSuccessSmsToAdmin(id: string) {
  try {
    // get orderById
    const order = await getOrderById(id);

    if (!order) {
      console.error("Order SMS Skipped: Order not found");
      return;
    }

    const { fullName, phone } = order.shippingAddress as ShippingAddress;

    if (!phone || !fullName) {
      console.warn(
        "Order SMS Skipped: Missing phone or fullname in shipping address.",
      );
      return;
    }
    const orderId = order.refNumber ?? order?.id;

    const result = await sendFastSms({
      mobile: ADMIN_MOBILE_NUMBER,
      templateId: Number(ORDER_SUCCESS_ADMIN_TEMPLATE_ID),
      parameters: [
        { name: "FULLNAME", value: fullName },
        { name: "PHONE", value: phone },
        { name: "ORDERID", value: orderId! },
      ],
    });

    if (!result) {
      console.error("SMS Provider Error: Failed to send order success SMS.");
    } else {
      console.log(`Order SMS sent to ${phone} for Order #${orderId}`);
    }
  } catch (err) {
    console.error("Internal Error sending order SMS:", err);
  }
}
