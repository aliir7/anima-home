import { db } from "@/db";
import { AuthResult } from "@/types/next-auth";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import bcrypt from "bcryptjs";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function getUser(
  email: string,
  password: string,
): Promise<AuthResult> {
  const user = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.email, email),
  });
  if (!user) {
    return { success: false, error: "EMAIL_NOT_FOUND" };
  }

  const isMatch = bcrypt.compare(password, user.password!);

  if (!isMatch) {
    return { success: false, error: "INVALID_PASSWORD" };
  }

  return { success: true, user };
}
