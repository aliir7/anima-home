import { ProjectWithCategory, QueryResult } from "@/types";
import { db } from "..";
import { projects } from "../schema/projects";
import { normalizeProject } from "@/lib/utils/normalize";
import { eq, sql } from "drizzle-orm";

export async function getAllProjects(): Promise<
  QueryResult<ProjectWithCategory[]>
> {
  try {
    const data = await db.query.projects.findMany({
      with: {
        category: {
          with: {
            parent: true,
          },
        },
      },
      orderBy: (projects, { desc }) => [desc(projects.createdAt)],
    });

    const normalized = (data as Partial<ProjectWithCategory>[]).map(
      normalizeProject,
    );

    return { success: true, data: normalized };
  } catch (error) {
    console.error("Error in getAllProjects:", error);
    return {
      success: false,
      error: "خطا در گرفتن لیست پروژه‌ها",
    };
  }
}

export async function getFilteredProjects({
  categoryId,
  page,
  pageSize,
}: {
  categoryId?: string;
  page?: number;
  pageSize?: number;
}): Promise<QueryResult<ProjectWithCategory[]>> {
  try {
    const offset = ((page ?? 1) - 1) * (pageSize ?? 6);
    const whereClause = categoryId
      ? eq(projects.categoryId, categoryId)
      : undefined;
    const data = await db
      .select()
      .from(projects)
      .where(whereClause)
      .limit(pageSize ?? 6)
      .offset(offset)
      .orderBy(projects.createdAt);
    const normalized = (data as Partial<ProjectWithCategory>[]).map(
      normalizeProject,
    );
    return { success: true, data: normalized };
  } catch (error) {
    console.error("Error in getFilteredProjects:", error);
    return { success: false, error: "خطا در گرفتن لیست پروژه‌ها" };
  }
}

export async function getProjectsCount(categoryId?: string): Promise<number> {
  try {
    const whereClause = categoryId
      ? eq(projects.categoryId, categoryId)
      : undefined;

    const result = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(projects)
      .where(whereClause);

    return Number(result[0]?.count ?? 0);
  } catch (error) {
    console.error("Error in getProjectsCount:", error);
    return 0;
  }
}

export async function getProjectById(
  id: string,
): Promise<QueryResult<ProjectWithCategory[]>> {
  try {
    const data = await db.select().from(projects).where(eq(projects.id, id));

    const normalized = (data as Partial<ProjectWithCategory>[]).map(
      normalizeProject,
    );
    return { success: true, data: normalized };
  } catch (error) {
    console.log("Error in ProjectById:", error);
    return { success: false, error: "خطا در گرفتن پروژه با آیدی" };
  }
}

export async function getProjectBySlug(
  slug: string,
): Promise<QueryResult<ProjectWithCategory>> {
  try {
    const [data] = await db
      .select()
      .from(projects)
      .where(eq(projects.slug, slug));
    if (!data) {
      return { success: false, error: "پروژه‌ای با این اسلاگ یافت نشد" };
    }
    const normalized = normalizeProject(data);
    return { success: true, data: normalized };
  } catch (error) {
    console.log("Error in getProjectBySlug:", error);
    return { success: false, error: "خطا در دریافت پروژه" };
  }
}
