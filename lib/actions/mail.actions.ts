"use server";

import { ActionResult } from "@/types";
import nodemailer from "nodemailer";

type SendMailActionProps = {
  email: string;
  replyTo?: string;
  subject: string;
  senderName?: string;
  text?: string;
  html?: string;
};

// for send email from anima home
const mailHost = process.env.MAIL_HOST;
const mailPort = process.env.MAIL_PORT || 587;
const mailUsername = process.env.MAIL_USER;
const mailPassword = process.env.MAIL_PASSWORD;
const mailFrom = process.env.MAIL_FROM;

// for recieve email from user
const gmailHost = process.env.GMAIL_HOST;
const gmailPort = process.env.GMAIL_PORT || 587;
const gmailUsername = process.env.GMAIL_USER;
const gmailPassword = process.env.GMAIL_PASSWORD;
const gmailFrom = process.env.GMAIL_FROM;

const transporter = nodemailer.createTransport({
  host: mailHost,
  secure: false,
  port: Number(mailPort),
  auth: { user: mailUsername, pass: mailPassword },
});

const gmailTransporter = nodemailer.createTransport({
  host: gmailHost,
  secure: false,
  port: Number(gmailPort),
  auth: { user: gmailUsername, pass: gmailPassword },
});

export async function sendMailAction({
  email,
  replyTo,
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
      replyTo: replyTo ?? "",
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

export async function sendGmailAction({
  email,
  replyTo,
  subject,
  senderName,
  html,
  text,
}: SendMailActionProps): Promise<ActionResult<string>> {
  try {
    const isVerified = await gmailTransporter.verify();
    if (!isVerified) {
      return {
        success: false,
        error: {
          type: "custom",
          message: "خطایی رخ داد کاربر مجاز به ارسال ایمیل نیست",
        },
      };
    }

    const sendMail = await gmailTransporter.sendMail({
      from: gmailFrom,
      to: email,
      subject,
      html: html ?? "",
      text: text ?? "",
      replyTo: replyTo ?? "",
      sender: senderName ?? "",
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
