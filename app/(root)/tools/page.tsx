import { Metadata } from "next";
import { services } from "@/lib/constants";
import ComingSoon from "@/components/shared/ComingSoon";

const pageTitle = services.at(-1)?.title;

export const revalidate = 3600; // 1hour

export const metadata: Metadata = {
  title: pageTitle || "ابزارآلات",
  robots: {
    index: false,
    follow: false,
  },
};

function ToolsPage() {
  return (
    <section className="wrapper py-12">
      <ComingSoon />
    </section>
  );
}

export default ToolsPage;
