import { db } from "@/db";
import { verificationTokens, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

type VerifyEmailPageProps = {
  params: Promise<{ token: string }>;
};

async function VerifyEmailPage({ params }: VerifyEmailPageProps) {
  const { token } = await params;

  // بقیه کد مثل قبل
  const tokenEntry = await db.query.verificationTokens.findFirst({
    where: eq(verificationTokens.token, token),
  });

  if (!tokenEntry) {
    return (
      <div className="p-8 text-center text-red-600">
        توکن نامعتبر یا منقضی شده است.
      </div>
    );
  }

  if (new Date(tokenEntry.expires) < new Date()) {
    return (
      <div className="p-8 text-center text-red-600">
        این لینک منقضی شده است.
      </div>
    );
  }

  await db
    .update(users)
    .set({ emailVerified: new Date() })
    .where(eq(users.email, tokenEntry.identifier));

  await db
    .delete(verificationTokens)
    .where(eq(verificationTokens.token, token));

  redirect("/sign-in?verified=1");

  return null;
}

export default VerifyEmailPage;
