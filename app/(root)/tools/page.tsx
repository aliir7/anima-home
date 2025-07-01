import { Metadata } from "next";
import { services } from "@/lib/constants";

const pageTitle = services.at(2)?.title;

export const metadata: Metadata = {
  title: pageTitle || "ابزارآلات",
};

function page() {
  return <div>tools</div>;
}

export default page;
