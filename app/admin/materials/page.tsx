import MaterialForm from "@/components/shared/Admin/Materials/MaterialsForm";
import { Metadata } from "next/types";

export const metadata: Metadata = {
  title: "متریال",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

function AdminMaterialsPage() {
  return (
    <section className="wrapper py-12">
      <h1 className="text-xl font-bold">مدیریت متریال‌ها</h1>
      <MaterialForm />
    </section>
  );
}

export default AdminMaterialsPage;
