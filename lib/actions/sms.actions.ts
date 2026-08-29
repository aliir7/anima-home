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
import { checkRateLimit, rateLimitMessage } from "../rate-limit";
import { getOrderById } from "../services/order.service";

// 1. اکشن ارسال کد تایید (هم برای ثبت‌نام سریع با موبایل و هم ورود با موبایل)
export async function sendOtpAction(mobile: string) {
  // 1. Validate mobile number
  const parsed = mobileSchema.safeParse({ mobile });

  if (!parsed.success) {
    return {
      success: false,
      message: "شماره موبایل معتبر نیست.",
    };
  }

  const { mobile: phoneNumber } = parsed.data;

  // 2. Rate limit per phone
  const phoneLimit = await checkRateLimit(
    "send-otp-phone",
    {
      windowMs: 10 * 60 * 1000,
      max: 3,
    },
    phoneNumber,
  );

  if (!phoneLimit.allowed) {
    return {
      success: false,
      message: rateLimitMessage(phoneLimit.retryAfterSeconds),
    };
  }

  // 3. Rate limit per IP
  const ipLimit = await checkRateLimit("send-otp-ip", {
    windowMs: 60 * 60 * 1000,
    max: 15,
  });

  if (!ipLimit.allowed) {
    return {
      success: false,
      message: rateLimitMessage(ipLimit.retryAfterSeconds),
    };
  }

  // 4. Better Auth → generate/store/send OTP
  try {
    await auth.api.sendPhoneNumberOTP({
      body: {
        phoneNumber,
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
  // 1. Validate mobile
  const mobileResult = mobileSchema.safeParse({
    mobile: data.mobile,
  });

  if (!mobileResult.success) {
    return {
      success: false,
      error: {
        message: "شماره موبایل معتبر نیست.",
      },
    };
  }

  // 2. Validate OTP
  const otpResult = otpSchema.safeParse({
    mobile: data.mobile,
    code: data.code,
  });

  if (!otpResult.success) {
    return {
      success: false,
      error: {
        message: "فرمت کد تایید معتبر نیست.",
      },
    };
  }

  const { mobile: phoneNumber, code } = otpResult.data;

  // 3. Rate limit OTP verification per phone
  const verifyLimit = await checkRateLimit(
    "verify-otp",
    {
      windowMs: 5 * 60 * 1000,
      max: 5,
    },
    phoneNumber,
  );

  if (!verifyLimit.allowed) {
    return {
      success: false,
      error: {
        message: rateLimitMessage(verifyLimit.retryAfterSeconds),
      },
    };
  }

  // 4. Better Auth → verify OTP
  try {
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
