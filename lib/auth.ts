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

        if (user.name === "NO_NAME") {
          token.name = user.email?.split("@")[0];
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

      if (trigger === "update") {
        session.user.name = user.name as string;
      }

      return session;
    },

    // ❌ بخش authorized به طور کامل از اینجا حذف شد
    // چون proxy.ts به بهترین شکل این کارها رو انجام میده
  },

  providers: [
    CredentialsProvider({
      name: "credentials",

      async authorize(credentials) {
        const validatedData = signinSchema.safeParse(credentials);
        if (!validatedData.success) {
          return null;
        }

        const { email, password } = validatedData.data;

        const user = await db.query.users.findFirst({
          where: eq(users.email, email),
        });

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
  ],
  events: {
    // ✅ این بخش عالیه و باید بمونه
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
