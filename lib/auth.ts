import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/db";
import { accounts, users, sessions, verificationTokens } from "@/db/schema";
import { getUser } from "./utils";
import { signinSchema } from "./validations/usersValidations";

export const authConfig = {
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30days
  },

  pages: {
    signIn: "sign-in",
    error: "sign-in",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;

        if (user.name === "NO_NAME") {
          token.name = user.email?.split("@")[0];
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
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

        const result = await getUser(email, password!);

        if (!result.success) {
          console.error("AuthError:", result.error);
          return null;
        }

        return {
          id: result.user.id,
          email: result.user.email,
          name: result.user.name,
          role: result.user.role,
        };
      },
    }),
  ],
} satisfies NextAuthConfig;
