import { Metadata } from "next";
import { services } from "@/lib/constants";

const pageTitle = services.at(-1)?.title;

export const metadata: Metadata = {
  title: pageTitle || "متریال",
};

function page() {
  return <div>materials</div>;
}

export default page;
