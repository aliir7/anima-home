import ComingSoon from "@/components/shared/ComingSoon";
import { Metadata } from "next/types";

export const metadata: Metadata = {
  title: "متریال",
};

function AdminMaterialsPage() {
  return (
    <section className="wrapper py-12">
      <ComingSoon />
    </section>
  );
}

export default AdminMaterialsPage;
