import { Metadata } from "next";
import { services } from "@/lib/constants";
import ComingSoon from "@/components/shared/ComingSoon";

const pageTitle = services.at(1)?.title;

export const revalidate = 86400; // 1 day

export const metadata: Metadata = {
  title: pageTitle || "متریال",
  robots: {
    index: false,
    follow: false,
  },
};

function MaterialsPage() {
  return (
    <section className="wrapper py-12">
      <ComingSoon />
    </section>
  );
}

export default MaterialsPage;
