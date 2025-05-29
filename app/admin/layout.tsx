// app/(admin)/layout.tsx
import AdminSidebar from "@/app/admin/AdminSidebar";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();
  if (!session || session.user.role !== "admin") {
    redirect("/");
  }
  return (
    <div className="bg-background text-foreground flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
    </div>
  );
}

export default AdminLayout;
