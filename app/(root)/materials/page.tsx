import { Metadata } from "next";
import { services } from "@/lib/constants";
import ComingSoon from "@/components/shared/ComingSoon";

const pageTitle = services.at(1)?.title;

export const metadata: Metadata = {
  title: pageTitle || "متریال",
};

function MaterialsPage() {
  return (
    <section className="wrapper py-12">
      <ComingSoon />
    </section>
  );
}

export default MaterialsPage;
