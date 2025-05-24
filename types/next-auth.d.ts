// types/next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
      image?: string;
    };
    expires: string;
  }

  interface User {
    id: string;
    role: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
  }
}

export type AuthResult =
  | { success: true; user: typeof users.$inferSelect }
  | { success: false; error: "EMAIL_NOT_FOUND" | "INVALID_PASSWORD" };
