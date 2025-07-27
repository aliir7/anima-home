import { getProjectBySlug } from "@/db/queries/projectQueries";
import { Metadata } from "next";

async function generateMetadata(
  params: Promise<{ slug: string }>,
): Promise<Metadata> {
  const slug = (await params).slug;
  const res = await getProjectBySlug(slug);

  if (!res.success || !res.data) {
    return {
      title: "پروژه پیدا نشد",
    };
  }

  const project = res.data;

  return {
    title: project.title,
    description: project.description,
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

export default generateMetadata;
