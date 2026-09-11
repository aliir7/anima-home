import { redirect } from "next/navigation";

import SidebarMenu from "@/components/shared/Account/SidebarMenu";
import { getCurrentSession } from "@/lib/auth/authGuard";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function MyAccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getCurrentSession();
  if (!session?.user) {
    redirect("/");
  }

  return (
    <div className="wrapper flex h-full flex-col gap-6 py-10 md:flex-row dark:text-neutral-100">
      <aside className="w-full md:w-1/4">
        <SidebarMenu user={session.user} />
      </aside>

      <main className="h-fit w-full space-y-8 md:w-3/4">{children}</main>
    </div>
  );
}

export default MyAccountLayout;
