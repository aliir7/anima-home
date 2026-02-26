import { requireAdmin } from "@/lib/auth/authGuard";

export default async function AdminDetailsOrder({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  requireAdmin();

  return <div></div>;
}
