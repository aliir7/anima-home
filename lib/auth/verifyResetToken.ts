import { db } from "@/db";
import { verificationTokens } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function verifyResetToken(token: string) {
  const tokenEntry = await db.query.verificationTokens.findFirst({
    where: eq(verificationTokens.token, token),
  });

  if (!tokenEntry || new Date(tokenEntry.expires) < new Date()) {
    return null;
  }

  return tokenEntry.identifier; // ایمیل کاربر
}
