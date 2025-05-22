import { db } from "@/db";
import { eq } from "drizzle-orm";
import { users } from "@/db/schema/user";

export async function getUserByEmail(email: string) {
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });
  return user ?? null;
}
