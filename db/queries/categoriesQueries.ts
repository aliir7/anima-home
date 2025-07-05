import { eq } from "drizzle-orm";
import { db } from "..";
import { categories } from "../schema";
import { console } from "inspector";
import { QueryResult } from "@/types";

export async function getCategoryBySlug(
  slug: string,
): Promise<QueryResult<(typeof categories.$inferSelect)[]>> {
  try {
    const data = await db
      .select()
      .from(categories)
      .where(eq(categories.slug, slug));

    return { success: true, data: data };
  } catch (error) {
    console.log("Error in getCategoryBySlug:", error);
    return { success: false, error: "خطا در گرفتن دسته بندی با اسلاگ" };
  }
}

export async function getCategoryById(
  id: string,
): Promise<QueryResult<(typeof categories.$inferSelect)[]>> {
  try {
    const data = await db
      .select()
      .from(categories)
      .where(eq(categories.id, id));

    return { success: true, data: data };
  } catch (error) {
    console.log("Error in getCategoryById:", error);
    return { success: false, error: "خطا در گرفتن دسته بندی با آیدی" };
  }
}

export async function getAllCategories(): Promise<
  QueryResult<(typeof categories.$inferSelect)[]>
> {
  try {
    const data = await db.select().from(categories).orderBy(categories.name);
    return { success: true, data: data };
  } catch (error) {
    console.log(error);
    return { success: false, error: "خطا در گرفتن لیست دسته بندی ها" };
  }
}
