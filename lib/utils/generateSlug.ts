// lib/utils/generateSlug.ts
import slugify from "slugify";
import { db } from "@/db";
import { projects } from "@/db/schema/projects";
import { eq } from "drizzle-orm";

export async function generateUniqueSlug(title: string): Promise<string> {
  const baseSlug = slugify(title, { lower: true, strict: true });
  let uniqueSlug = baseSlug;
  let counter = 1;

  while (true) {
    const exists = await db.query.projects.findFirst({
      where: eq(projects.slug, uniqueSlug),
    });

    if (!exists) break;

    uniqueSlug = `${baseSlug}-${counter++}`;
  }

  return uniqueSlug;
}
