import { CategoryWithParent, QueryResult } from "@/types";
import { eq } from "drizzle-orm";
import { cache } from "react";
import { db } from "..";
import { withDbError } from "../helpers/withDbError";
import { categories } from "../schema/index";

export const getCategoryBySlug = cache(
  async (slug: string): Promise<QueryResult<CategoryWithParent[]>> =>
    withDbError(async () => {
      const data = await db.query.categories.findMany({
        where: eq(categories.slug, slug),
        with: {
          parent: true,
          children: true,
        },
      });
      return data;
    }, "خطا در گرفتن دسته‌بندی با اسلاگ"),
);

export const getCategoryById = cache(
  async (id: string): Promise<QueryResult<CategoryWithParent[]>> =>
    withDbError(async () => {
      const data = await db.query.categories.findMany({
        where: eq(categories.id, id),
        with: {
          parent: true,
          children: true,
        },
      });
      return data;
    }, "خطا در گرفتن دسته‌بندی با شناسه"),
);

export const getAllProjectCategories = cache(
  async (): Promise<QueryResult<CategoryWithParent[]>> =>
    withDbError(async () => {
      const data = await db.query.categories.findMany({
        with: {
          parent: true,
          children: true,
        },
        orderBy: (categories, { desc }) => [desc(categories.createdAt)],
      });
      return data;
    }, "خطا در گرفتن لیست دسته‌بندی‌های پروژه ها"),
);

export const getAllProductCategories = cache(
  async (): Promise<QueryResult<CategoryWithParent[]>> =>
    withDbError(async () => {
      const data = await db.query.productCategories.findMany({
        with: {
          parent: true,
          children: true,
        },
        orderBy: (categories, { desc }) => [desc(categories.createdAt)],
      });
      return data;
    }, "خطا در گرفتن لیست دسته‌بندی‌های محصولات"),
);

export const getCategoryChildren = cache(
  async (parentId: string): Promise<QueryResult<CategoryWithParent[]>> =>
    withDbError(async () => {
      const data = await db.query.categories.findMany({
        where: eq(categories.parentId, parentId),
        with: {
          parent: true,
          children: true,
        },
      });
      return data;
    }, "خطا در گرفتن زیر‌دسته‌ها"),
);
