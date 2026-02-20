"use server";

import { ActionResult, ContactFormValues } from "@/types";
import { contactFormSchema } from "../validations/usersValidations";
import { sendGmailAction, sendMailAction } from "./mail.actions";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { users } from "@/db/schema";

export async function submitContactForm(
  data: ContactFormValues,
): Promise<ActionResult<string>> {
  try {
    const validated = contactFormSchema.safeParse(data);

    if (!validated.success) {
      return {
        success: false,
        error: {
          type: "zod",
          issues: validated.error.issues,
        },
      };
    }

    const { name, email, message, subject } = validated.data;
    const finalSubject = subject || "پیام جدید از فرم تماس";

    // 3. ساخت HTML (همان قالب تمیز و مدرن)
    const htmlContent = `
    <div style="background-color: #f3f4f6; padding: 40px 0; direction: rtl; font-family: Tahoma, Arial, sans-serif; line-height: 1.6;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
        
        <div style="text-align: center; margin-bottom: 30px;">
          <h2 style="color: #1f2937; margin: 0; font-size: 24px;">📩 پیام جدید از فرم تماس</h2>
        </div>

        <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin-bottom: 25px; border: 1px solid #e5e7eb;">
          <p style="margin: 10px 0; color: #374151;"><strong>👤 نام فرستنده:</strong> ${name}</p>
          <p style="margin: 10px 0; color: #374151;"><strong>📧 ایمیل فرستنده:</strong> ${email}</p>
          <p style="margin: 10px 0; color: #374151;"><strong>🔖 موضوع:</strong> ${finalSubject}</p>
        </div>

        <div style="margin-bottom: 30px;">
          <h3 style="color: #374151; font-size: 18px; border-bottom: 2px solid #4a5a45; display: inline-block; padding-bottom: 5px;">متن پیام:</h3>
          <div style="background-color: #fff; border-right: 4px solid #4a5a45; padding: 15px; color: #4b5563; white-space: pre-line;">
            ${message}
          </div>
        </div>

        <div style="text-align: center;">
          <a href="mailto:${email}?subject=پاسخ: ${finalSubject}" 
             style="display: inline-block; padding: 12px 30px; background-color: #4a5a45; color: white; text-decoration: none; border-radius: 8px;">
             پاسخ به کاربر
          </a>
        </div>

      </div>
    </div>
  `;

    // 4. ارسال ایمیل به مدیر سایت (شما)
    const receiverEmail = process.env.MAIL_ADMIN || "info@anima-home.ir";

    return await sendGmailAction({
      email: receiverEmail,
      replyTo: email,
      senderName: name,
      subject: `فرم تماس: ${name} - ${finalSubject}`,
      html: htmlContent,
      text: `پیام از ${name} (${email}):\n\n${message}`,
    });
  } catch (error) {
    return {
      success: false,
      error: { type: "custom", message: `خطا در ارسال ایمیل ${error}` },
    };
  }
}

export async function getUserById(userId: string) {
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  if (!user) {
    throw new Error("کاربر یافت نشد");
  }

  return { ...user };
}
