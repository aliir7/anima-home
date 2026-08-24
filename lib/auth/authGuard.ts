import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "../auth";

export async function getCurrentSession() {
  return auth.api.getSession({
    headers: await headers(),
  });
}

export async function requireAdmin() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user || session.user.role !== "admin") {
    redirect("/");
  }

  return session;
}
