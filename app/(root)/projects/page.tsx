import { Metadata } from "next";
import { services } from "@/lib/constants";

const pageTitle = services.at(0)?.title;

export const metadata: Metadata = {
  title: pageTitle || "پروژه‌ها",
};

function page() {
  return <div>projects</div>;
}

export default page;
