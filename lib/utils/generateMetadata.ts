import { getProjectBySeoSlug } from "@/db/queries/projectQueries";
import { Metadata } from "next";

export async function generateMetadata(seoSlug: string): Promise<Metadata> {
  const res = await getProjectBySeoSlug(seoSlug);

  if (!res.success || !res.data) {
    return {
      title: "پروژه پیدا نشد",
    };
  }

  const project = res.data;

  return {
    title: project.title,
    description: project.description ?? "",
    alternates: {
      canonical: `https://anima-home.ir/projects/${project.seoSlug}`,
    },
    openGraph: {
      title: project.title,
      description: project.description ?? "",
      images: project.images?.length
        ? [
            {
              url: `https://anima-home.ir${project.images[0]}`,
              width: 1200,
              height: 630,
              alt: project.title,
            },
          ]
        : undefined,
    },
  };
}
