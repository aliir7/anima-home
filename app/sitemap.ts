// app/sitemap.ts
import type { MetadataRoute } from "next";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { sanitizeUrl } from "@/lib/utils/urlUtils";

// Revalidate sitemap every 24 hours (ISR)
export const revalidate = 86400;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://anima-home.ir";

  const allProjects = await db
    .select({ seoSlug: projects.seoSlug })
    .from(projects);

  const urls: MetadataRoute.Sitemap = [
    {
      url: sanitizeUrl(`${baseUrl}/`),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: sanitizeUrl(`${baseUrl}/projects`),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: sanitizeUrl(`${baseUrl}/materials`),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: sanitizeUrl(`${baseUrl}/about`),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: sanitizeUrl(`${baseUrl}/contact`),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: sanitizeUrl(`${baseUrl}/faq`),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    // dynamic projects
    ...allProjects.map((p) => ({
      url: sanitizeUrl(`${baseUrl}/projects/${p.seoSlug}`),
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];

  // Filter out any falsy / malformed urls just in case
  return urls.filter((u) => typeof u.url === "string" && u.url.length > 0);
}
