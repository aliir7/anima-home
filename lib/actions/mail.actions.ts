"use server";

import { ActionResult } from "@/types";
import nodemailer from "nodemailer";

type SendMailActionProps = {
  email: string;

  subject: string;
  text?: string;
  html?: string;
};

const mailHost = process.env.MAIL_HOST;
const mailPort = process.env.MAIL_PORT || 465;
const mailUsername = process.env.MAIL_USERNAME;
const mailPassword = process.env.MAIL_PASSWORD;
const mailFrom = process.env.MAIL_FROM;

const transporter = nodemailer.createTransport({
  host: mailHost,
  secure: false,
  port: Number(mailPort),
  auth: { user: mailUsername, pass: mailPassword },
});

export async function sendMailAction({
  email,

  subject,
  html,
  text,
}: SendMailActionProps): Promise<ActionResult<string>> {
  try {
    const isVerified = await transporter.verify();
    if (!isVerified) {
      return {
        success: false,
        error: {
          type: "custom",
          message: "خطایی رخ داد کاربر مجاز به ارسال ایمیل نیست",
        },
      };
    }

    const sendMail = await transporter.sendMail({
      from: mailFrom,
      to: email,
      subject,
      html: html ?? "",
      text: text ?? "",
    });

    if (!sendMail) {
      return {
        success: false,
        error: { type: "custom", message: "خطایی در ارسال ایمیل رخ داد" },
      };
    }

    return { success: true, data: `ایمیل ${subject} ارسال شد` };
  } catch (error) {
    return {
      success: false,
      error: { type: "custom", message: `خطا در ارسال ایمیل ${error}` },
    };
  }
}
