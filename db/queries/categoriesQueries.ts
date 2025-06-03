import { eq } from "drizzle-orm";
import { db } from "..";
import { categories } from "../schema";
import { console } from "inspector";

export async function getCategoryBySlug(slug: string) {
  try {
    const category = await db.query.categories.findFirst({
      where: eq(categories.slug, slug),
    });
    return category;
  } catch (error) {
    console.error("Error in getCategoryBySlug:", error);
    throw error;
  }
}

export async function getAllCategories() {
  try {
    const allCategories = await db.select().from(categories);
    return allCategories;
  } catch (error) {
    console.error("Error in get all Categories", error);
  }
}
