import type { MetadataRoute } from "next";
import { db } from "@/db";
import { projects } from "@/db/schema";

export const revalidate = 86400; // روزی یکبار آپدیت
export const dynamic = "force-dynamic"; // جلوگیری از prerender-error

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://anima-home.ir";

  const allProjects = await db
    .select({ seoSlug: projects.seoSlug })
    .from(projects);

  return [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    ...allProjects.map((p) => ({
      url: `${baseUrl}/projects/${p.seoSlug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
