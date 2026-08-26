import bcrypt from "bcryptjs";
import { betterAuth, isProduction } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { verifyPassword } from "better-auth/crypto";
import { nextCookies } from "better-auth/next-js";
import { phoneNumber } from "better-auth/plugins";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";

import { db } from "@/db";
import * as schema from "@/db/schema";
import { carts } from "@/db/schema";
import { SERVER_URL } from "@/lib/constants";
import { sendMailAction } from "./actions/mail.actions";
import { NEXT_PUBLIC_OTP_TEMPLATE_ID } from "./constants";
import { sendFastSms } from "./sms";

export const auth = betterAuth({
  baseURL: isProduction ? process.env.BETTER_AUTH_URL : "http://localhost:3000",
  database: drizzleAdapter(db, {
    provider: "pg",

    schema: {
      ...schema,

      // Better Auth expects these logical models.
      user: schema.users,
      account: schema.accounts,
      session: schema.sessions,
      verification: schema.verifications,
    },
  }),

  user: {
    modelName: "users",

    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "user",
        input: false,
      },
      // phoneNumber / phoneNumberVerified are registered by the
      // phoneNumber plugin below — no need to redeclare them here.
    },
  },

  account: {
    modelName: "account",
  },

  session: {
    modelName: "session",
  },

  verification: {
    modelName: "verification",
  },

  emailAndPassword: {
    enabled: true,

    // هم‌راستا با signupSchema (حداقل ۶ کاراکتر)
    minPasswordLength: 6,
    maxPasswordLength: 50,

    // کاربر تا وقتی ایمیلش را تأیید نکند نمی‌تواند وارد شود
    requireEmailVerification: true,
    autoSignIn: false,

    resetPasswordTokenExpiresIn: 60 * 30, // 30 دقیقه

    // ✅ پشتیبانی از ۳ کاربر قدیمی که پسوردشان با bcryptjs هش شده بود
    //
    // نکته‌ی مهم: فقط verify را override می‌کنیم، نه hash را. یعنی از
    // این به بعد، هر پسورد جدید (ثبت‌نام تازه، تغییر پسورد، بازیابی
    // پسورد) با همان الگوریتم قوی‌تر پیش‌فرض خودِ Better Auth (scrypt)
    // هش می‌شود — نه bcrypt. verify فقط برای تشخیص و پذیرفتن هش‌های
    // قدیمی bcrypt (که همیشه با "$2" شروع می‌شوند) لازم است؛ برای بقیه
    // (هش‌های native خودِ Better Auth)، مستقیم از تابع verifyPassword
    // خودِ کتابخانه استفاده می‌کنیم.
    password: {
      verify: async ({
        password,
        hash,
      }: {
        password: string;
        hash: string;
      }) => {
        if (hash.startsWith("$2")) {
          // هش قدیمی bcrypt (کاربران قبل از مهاجرت به Better Auth)
          return bcrypt.compare(password, hash);
        }
        // هش native خودِ Better Auth (scrypt)
        return verifyPassword({ password, hash });
      },
    },

    sendResetPassword: async ({ user, token }) => {
      const resetLink = `${SERVER_URL}/reset-password/${token}`;
      const subject = "بازیابی رمز عبور";
      const html = `<p>درخواست بازیابی رمز عبور ثبت شده است.</p><p>برای بازیابی رمز عبور روی لینک زیر کلیک کنید:</p><a href="${resetLink}">${resetLink}</a><p>این لینک فقط تا ۳۰ دقیقه اعتبار دارد.</p><br /><p>اگر این درخواست از طرف شما نبوده، این پیام را نادیده بگیرید.</p>`;

      void sendMailAction({ email: user.email, subject, html }).catch((error) =>
        console.error("sendResetPassword email failed:", error),
      );
    },
  },

  emailVerification: {
    expiresIn: 60 * 60 * 24, // 24 ساعت
    autoSignInAfterVerification: true,

    sendVerificationEmail: async ({ user, url }) => {
      const subject = "تأیید ایمیل شما در انیما هوم";
      const html = `
        <div style="direction: rtl; font-family: sans-serif;">
          <h2>سلام 👋</h2>
          <p>برای فعال‌سازی حساب خود در <strong>Anima Home</strong>، روی دکمه زیر کلیک کنید:</p>
          <a href="${url}"
             style="display:inline-block;padding:10px 20px;background:#4a5a45;color:white;text-decoration:none;border-radius:8px;margin-top:20px;">
             تأیید ایمیل
          </a>
          <p style="margin-top:30px;">اگر این درخواست از طرف شما نبوده، لطفاً این ایمیل را نادیده بگیرید.</p>
        </div>
      `;

      void sendMailAction({ email: user.email, subject, html }).catch((error) =>
        console.error("sendVerificationEmail failed:", error),
      );
    },
  },

  // معادل events.signIn قدیمی NextAuth: merge سبد خرید مهمان با حساب کاربر
  databaseHooks: {
    session: {
      create: {
        after: async (session) => {
          try {
            const sessionCartId = (await cookies()).get("sessionCartId")?.value;

            if (!sessionCartId) return;

            const guestCart = await db.query.carts.findFirst({
              where: eq(carts.sessionCartId, sessionCartId),
            });

            if (!guestCart) return;

            await db.delete(carts).where(eq(carts.userId, session.userId));

            await db
              .update(carts)
              .set({ userId: session.userId, sessionCartId: null })
              .where(eq(carts.id, guestCart.id));
          } catch (error) {
            console.error("Cart merge on sign-in failed:", error);
          }
        },
      },
    },
  },

  plugins: [
    phoneNumber({
      otpLength: 6,
      expiresIn: 120,
      allowedAttempts: 5,

      sendOTP: async ({ phoneNumber, code }) => {
        const currentTime = new Date().toLocaleTimeString("fa-IR", {
          hour: "2-digit",
          minute: "2-digit",
        });

        const result = await sendFastSms({
          mobile: phoneNumber,
          templateId: Number(NEXT_PUBLIC_OTP_TEMPLATE_ID),
          parameters: [
            { name: "VERIFICATIONCODE", value: code },
            { name: "TIME", value: currentTime },
          ],
        });

        if (!result) {
          throw new Error("Failed to send OTP SMS");
        }
      },

      signUpOnVerification: {
        getTempEmail: (phoneNumber) => `${phoneNumber}@phone.anima-home.ir`,
      },
    }),

    nextCookies(),
  ],
});

// تایپ سشن/یوزر
export type Session = typeof auth.$Infer.Session;
