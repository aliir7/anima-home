import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/db";
import { accounts, users, sessions, verificationTokens } from "@/db/schema";
import { signinSchema } from "./validations/usersValidations";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export const authConfig = {
  trustHost: true,
  secret: process.env.NEXTAUTH_SECRET,

  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),

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
        token.role = user.role;
      } else {
        // 🔁 وقتی user وجود نداره (مثلاً در رفرش)، از DB بخون
        const dbUser = await db.query.users.findFirst({
          where: eq(users.id, token.sub!),
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
} satisfies NextAuthConfig;

export const {
  auth,
  handlers: { GET, POST },
  signIn,
  signOut,
} = NextAuth(authConfig);
