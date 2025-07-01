import { Metadata } from "next";
import { services } from "@/lib/constants";

const pageTitle = services.at(1)?.title;

export const metadata: Metadata = {
  title: pageTitle || "محصولات",
};

function page() {
  return <div>products</div>;
}

export default page;
