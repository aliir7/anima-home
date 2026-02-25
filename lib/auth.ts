/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/db";
import {
  accounts,
  users,
  sessions,
  verificationTokens,
  carts,
} from "@/db/schema";
import { signinSchema } from "./validations/usersValidations";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { getUserByEmail } from "@/db/queries/getUserByEmail";

export const authConfig = {
  trustHost: true,
  secret: process.env.NEXTAUTH_SECRET,

  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }) as any,

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.role = user.role;
        // موبایل را هم در توکن ذخیره می‌کنیم (اختیاری ولی کاربردی)
        token.phone = (user as any).phone;

        // 🟢 تغییر: چون ایمیل ممکن است نال باشد، از موبایل به عنوان نام پیش‌فرض استفاده می‌کنیم
        if (user.name === "NO_NAME") {
          token.name =
            (user as any).phone || user.email?.split("@")[0] || "کاربر جدید";
        }
      } else {
        if (!token.sub) {
          return token;
        }

        const dbUser = await db.query.users.findFirst({
          where: eq(users.id, token.sub),
        });

        if (dbUser) {
          token.role = dbUser.role;
        }
      }

      return token;
    },

    async session({ session, token, trigger, user }) {
      session.user.id = token.sub as string;
      session.user.role = token.role as string;
      session.user.name = token.name as string;
      // اضافه کردن موبایل به سشن
      (session.user as any).phone = token.phone as string;

      if (trigger === "update") {
        session.user.name = user.name as string;
      }

      return session;
    },
  },

  providers: [
    // ==========================================
    // 1️⃣ پروایدر قدیمی (ورود با ایمیل و رمز عبور)
    // ==========================================
    CredentialsProvider({
      id: "credentials", // شناسه صریح
      name: "credentials",
      async authorize(credentials) {
        const validatedData = signinSchema.safeParse(credentials);
        if (!validatedData.success) {
          return null;
        }

        const { email, password } = validatedData.data;

        // چون ایمیل ممکن است نال باشد، حتما باید ایمیل‌های معتبر بررسی شوند
        const user = await getUserByEmail(email ?? "");

        if (!user || !user.password) {
          console.error("AuthError:", "کاربری یافت نشد");
          return null;
        }

        const isValid = await bcrypt.compare(password as string, user.password);
        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
        };
      },
    }),

    // ==========================================
    // 2️⃣ پروایدر جدید (ورود با شماره موبایل و OTP)
    // ==========================================
    CredentialsProvider({
      id: "otp", // 👈 شناسه اختصاصی برای فرم OTP
      name: "otp",
      credentials: {
        phone: { label: "شماره موبایل", type: "text" },
        code: { label: "کد تایید", type: "text" },
      },
      async authorize(credentials) {
        const phone = credentials?.phone as string;
        const code = credentials?.code as string;

        if (!phone || !code) {
          console.error("AuthError:", "شماره موبایل و کد الزامی است");
          return null;
        }

        // پیدا کردن کاربر با شماره موبایل
        const user = await db.query.users.findFirst({
          where: eq(users.phone, phone),
        });

        if (!user) {
          console.error("AuthError:", "کاربری با این شماره یافت نشد");
          return null;
        }

        // بررسی درستی کد OTP
        if (user.otp !== code) {
          console.error("AuthError:", "کد وارد شده اشتباه است");
          return null; // در کلاینت اکشن خطا می‌دهد
        }

        // بررسی انقضای کد OTP
        if (!user.otpExpiresAt || new Date() > user.otpExpiresAt) {
          console.error("AuthError:", "کد منقضی شده است");
          return null;
        }

        // 🟢 عملیات موفق!
        // به دلایل امنیتی حتماً کد مصرف شده را از دیتابیس پاک می‌کنیم
        await db
          .update(users)
          .set({
            otp: null,
            otpExpiresAt: null,
            phoneVerified: new Date(), // ثبت تاریخ تایید شماره
          })
          .where(eq(users.id, user.id));

        // برگرداندن کاربر به NextAuth برای ساخت سشن
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
          phone: user.phone,
        };
      },
    }),
  ],

  events: {
    async signIn({ user }) {
      const cookieStore = await cookies();
      const sessionCartId = cookieStore.get("sessionCartId")?.value;

      if (!sessionCartId) return;

      const sessionCart = await db.query.carts.findFirst({
        where: eq(carts.sessionCartId, sessionCartId),
      });

      if (!sessionCart) return;

      await db.delete(carts).where(eq(carts.userId, user.id));

      await db
        .update(carts)
        .set({
          userId: user.id,
          sessionCartId: null,
        })
        .where(eq(carts.id, sessionCart.id));
    },
  },
} satisfies NextAuthConfig;

export const {
  auth,
  handlers: { GET, POST },
  signIn,
  signOut,
} = NextAuth(authConfig);
