import { db } from "@/db";
import { verificationTokens, users } from "@/db/schema";
import { VerifyEmailResult } from "@/types";
import { eq } from "drizzle-orm";

export async function verifyEmailByToken(
  token: string,
): Promise<VerifyEmailResult> {
  const tokenEntry = await db.query.verificationTokens.findFirst({
    where: eq(verificationTokens.token, token),
  });

  if (!tokenEntry) {
    return {
      success: false,
      message: "توکن نامعتبر یا منقضی شده است.",
    };
  }

  if (new Date(tokenEntry.expires) < new Date()) {
    return {
      success: false,
      message: "این لینک منقضی شده است.",
    };
  }

  await db
    .update(users)
    .set({ emailVerified: new Date() })
    .where(eq(users.email, tokenEntry.identifier));

  await db
    .delete(verificationTokens)
    .where(eq(verificationTokens.token, token));

  return {
    success: true,
    message: "ایمیل شما با موفقیت تأیید شد.",
  };
}
