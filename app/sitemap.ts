// app/sitemap.ts
import type { MetadataRoute } from "next";
import { db } from "@/db";
import { products, projects } from "@/db/schema";
import { sanitizeUrl } from "@/lib/utils/urlUtils";

// Revalidate sitemap every 24 hours (ISR)
export const revalidate = 86400;
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://anima-home.ir";

  const allProjects = await db
    .select({ seoSlug: projects.seoSlug })
    .from(projects);

  const allProducts = await db
    .select({ seoSlug: products.seoSlug })
    .from(products);

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
      url: sanitizeUrl(`${baseUrl}/shop/products`),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
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
      url: sanitizeUrl(`${baseUrl}/privacy`),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: sanitizeUrl(`${baseUrl}/terms`),
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
      url: sanitizeUrl(`${baseUrl}/my-account`),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: sanitizeUrl(`${baseUrl}/my-account/orders`),
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
    {
      url: sanitizeUrl(`${baseUrl}/shop/cart`),
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
    // dynamic product
    ...allProducts.map((p) => ({
      url: sanitizeUrl(`${baseUrl}/shop/products/${p.seoSlug}`),
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1,
    })),
  ];

  // Filter out any falsy / malformed urls just in case
  return urls.filter((u) => typeof u.url === "string" && u.url.length > 0);
}
