"use server";

import { isAPIError } from "better-auth/api";
import { headers } from "next/headers";

import { ShippingAddress } from "@/types";
import { auth } from "../auth";
import {
  ADMIN_MOBILE_NUMBER,
  ORDER_SUCCESS_ADMIN_TEMPLATE_ID,
  ORDER_SUCCESS_CLIENT_TEMPLATE_ID,
} from "../constants";
import { sendFastSms } from "../sms";
import { mobileSchema, otpSchema } from "../validations/smsValidations";
import { getOrderById } from "./order.actions";

// 1. اکشن ارسال کد تایید (هم برای ثبت‌نام سریع با موبایل و هم ورود با موبایل)
export async function sendOtpAction(mobile: string) {
  const parsed = mobileSchema.safeParse({ mobile });

  if (!parsed.success) {
    return {
      success: false,
      message: "شماره موبایل معتبر نیست.",
    };
  }

  const { mobile: phoneNumber } = parsed.data;
  try {
    await auth.api.sendPhoneNumberOTP({
      body: {
        phoneNumber: phoneNumber,
      },
    });

    return {
      success: true,
      message: "کد تایید ارسال شد.",
    };
  } catch (error) {
    console.error("OTP send error:", error);

    return {
      success: false,
      message: "ارسال کد تایید انجام نشد.",
    };
  }
}

// 2. اکشن تایید کد و ورود/ثبت‌نام
export async function signinWithOtpAction(data: {
  mobile: string;
  code: string;
}) {
  const mobileResult = mobileSchema.safeParse({
    mobile: data.mobile,
  });

  // ✅ اصلاح: اضافه کردن mobile به safeParse
  const otpResult = otpSchema.safeParse({
    mobile: data.mobile,
    code: data.code,
  });

  if (!mobileResult.success) {
    return {
      success: false,
      error: {
        message: "شماره موبایل معتبر نیست.",
      },
    };
  }

  if (!otpResult.success) {
    // 💡 پیشنهاد: برای دیباگ بهتر در محیط لوکال، خطای دقیق Zod را چاپ کنید
    console.log("Zod OTP Validation Error:", otpResult.error.flatten());
    return {
      success: false,
      error: {
        message: "فرمت کد تایید معتبر نیست (باید ۶ رقم باشد).",
      },
    };
  }

  try {
    // ✅ حالا چون mobile را به otpSchema دادیم، otpResult.data شامل mobile هم هست
    // و متغیر phoneNumber دیگر undefined نخواهد بود!
    const { mobile: phoneNumber, code } = otpResult.data;

    await auth.api.verifyPhoneNumber({
      body: {
        phoneNumber,
        code,
      },
      headers: await headers(),
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error("OTP verification error:", error);
    if (isAPIError(error)) {
      return {
        success: false,
        error: {
          message: "کد وارد شده اشتباه یا منقضی شده است.",
        },
      };
    }
    return {
      success: false,
      error: {
        message: "خطای ناشناخته رخ داد.",
      },
    };
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
