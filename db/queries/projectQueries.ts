import { ProjectWithCategory, QueryResult } from "@/types";
import { db } from "..";
import { projects } from "../schema/projects";
import { normalizeProject } from "@/lib/utils/normalize";
import { eq, sql } from "drizzle-orm";
import { cache } from "react";
import { withDbError } from "../helpers/withDbError";

function normalizeProjectRow(row: typeof projects.$inferSelect) {
  return normalizeProject({
    ...row,
    images: row.images as string[],
    videos: (row.videos as string[]) ?? [],
  });
}

export const getAllProjects = cache(
  async ({
    page = 1,
    pageSize = 6,
  }: {
    page?: number;
    pageSize?: number;
  }): Promise<QueryResult<ProjectWithCategory[]>> =>
    withDbError(async () => {
      const offset = (page - 1) * pageSize;

      const data = await db.query.projects.findMany({
        with: {
          category: {
            with: {
              parent: true,
            },
          },
        },

        orderBy: (projects, { desc }) => [desc(projects.createdAt)],

        limit: pageSize,
        offset,
      });

      return (data as Partial<ProjectWithCategory>[]).map(normalizeProject);
    }, "خطا در گرفتن لیست پروژه‌ها"),
);

export const getFilteredProjects = cache(
  async ({
    categoryId,
    page = 1,
    pageSize = 6,
  }: {
    categoryId?: string;
    page?: number;
    pageSize?: number;
  }): Promise<QueryResult<ProjectWithCategory[]>> =>
    withDbError(async () => {
      const offset = (page - 1) * pageSize;

      const data = await db.query.projects.findMany({
        where: categoryId ? eq(projects.categoryId, categoryId) : undefined,

        with: {
          category: {
            with: {
              parent: true,
            },
          },
        },

        orderBy: (projects, { desc }) => [
          projects.categoryId,
          desc(projects.createdAt),
        ],

        limit: pageSize,
        offset,
      });

      return data.map(normalizeProjectRow);
    }, "خطا در گرفتن لیست پروژه‌ها"),
);

export const getProjectsCount = cache(
  async (categoryId?: string): Promise<number> => {
    try {
      const whereClause = categoryId
        ? eq(projects.categoryId, categoryId)
        : undefined;

      const result = await db
        .select({
          count: sql<number>`COUNT(*)`,
        })
        .from(projects)
        .where(whereClause);

      return Number(result[0]?.count ?? 0);
    } catch (error) {
      console.error(error);
      return 0;
    }
  },
);

export const getProjectById = cache(
  async (id: string): Promise<QueryResult<ProjectWithCategory[]>> =>
    withDbError(async () => {
      const data = await db.select().from(projects).where(eq(projects.id, id));

      return (data as Partial<ProjectWithCategory>[]).map(normalizeProject);
    }, "خطا در گرفتن پروژه با آیدی"),
);

export const getProjectBySlug = cache(
  async (slug: string): Promise<QueryResult<ProjectWithCategory>> =>
    withDbError(async () => {
      // ابتدا تلاش با seoSlug (Canonical URL)
      let [project] = await db
        .select()
        .from(projects)
        .where(eq(projects.seoSlug, slug));

      // اگر پیدا نشد، اسلاگ قدیمی را بررسی کن
      if (!project) {
        [project] = await db
          .select()
          .from(projects)
          .where(eq(projects.slug, slug));
      }

      if (!project) {
        throw new Error("Project not found");
      }

      return normalizeProjectRow(project);
    }, "خطا در دریافت پروژه"),
);

export const getProjectBySeoSlug = cache(
  async (seoSlug: string): Promise<QueryResult<ProjectWithCategory>> => {
    try {
      const [data] = await db
        .select()
        .from(projects)
        .where(eq(projects.seoSlug, seoSlug));

      if (!data) {
        return {
          success: false,
          error: "پروژه‌ای با این اسلاگ یافت نشد",
        };
      }

      const fixedData = normalizeProjectRow(data);

      return {
        success: true,
        data: normalizeProject(fixedData),
      };
    } catch (error) {
      console.error(error);

      return {
        success: false,
        error: "خطا در دریافت پروژه",
      };
    }
  },
);
