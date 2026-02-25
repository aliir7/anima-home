import { smsBuilder } from "sms-typescript";

// 1. بررسی وجود کلید API
if (!process.env.SMS_IR_API_KEY) {
  throw new Error("SMS_IR_API_KEY is not defined in environment variables.");
}

// 2. ساخت نمونه smsBuilder
const sms = smsBuilder({
  apiKey: process.env.SMS_IR_API_KEY,
  lineNumber: Number(process.env.SMS_IR_LINE_NUMBER || 0),
});

interface SendFastSmsParams {
  mobile: string;
  templateId: number;
  parameters: { name: string; value: string }[];
}

/**
 * تابع ارسال پیامک سریع (Verify Code)
 */
export async function sendFastSms({
  mobile,
  templateId,
  parameters,
}: SendFastSmsParams) {
  try {
    // ✅ اصلاح شده: پاس دادن 3 آرگومان جداگانه طبق پیام خطا
    const response = await sms.sendVerifyCode(mobile, templateId, parameters);

    return response;
  } catch (error) {
    console.error("SMS Sending Error:", error);
    return null;
  }
}
