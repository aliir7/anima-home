import { eq } from "drizzle-orm";
import { db } from "..";
import { categories } from "../schema/index";
import { CategoryWithParent, QueryResult } from "@/types";

export async function getCategoryBySlug(
  slug: string,
): Promise<QueryResult<CategoryWithParent[]>> {
  try {
    const data = await db.query.categories.findMany({
      where: eq(categories.slug, slug),
      with: {
        parent: true,
        children: true,
      },
    });

    return { success: true, data };
  } catch (error) {
    console.error("Error in getCategoryBySlug:", error);
    return {
      success: false,
      error: "خطا در گرفتن دسته‌بندی با اسلاگ",
    };
  }
}

export async function getCategoryById(
  id: string,
): Promise<QueryResult<CategoryWithParent[]>> {
  try {
    const data = await db.query.categories.findMany({
      where: eq(categories.id, id),
      with: {
        parent: true,
        children: true,
      },
    });

    return { success: true, data };
  } catch (error) {
    console.error("Error in getCategoryById:", error);
    return {
      success: false,
      error: "خطا در گرفتن دسته‌بندی با شناسه",
    };
  }
}

export async function getAllCategories(): Promise<
  QueryResult<CategoryWithParent[]>
> {
  try {
    const data = await db.query.categories.findMany({
      with: {
        parent: true,
        children: true,
      },
      orderBy: (categories, { desc }) => [desc(categories.createdAt)],
    });

    return { success: true, data };
  } catch (error) {
    console.error("Error in getAllCategories:", error);
    return {
      success: false,
      error: "خطا در گرفتن لیست دسته‌بندی‌ها",
    };
  }
}

export async function getCategoryChildren(
  parentId: string,
): Promise<QueryResult<CategoryWithParent[]>> {
  try {
    const data = await db.query.categories.findMany({
      where: eq(categories.parentId, parentId),
      with: {
        parent: true,
        children: true,
      },
    });

    return { success: true, data };
  } catch (error) {
    console.error("Error in getCategoryChildren:", error);
    return {
      success: false,
      error: "خطا در گرفتن زیر‌دسته‌ها",
    };
  }
}
