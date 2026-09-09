// lib/utils/generateSlug.ts
import slugify from "slugify";
import { db } from "@/db";
import { projects } from "@/db/schema/projects";
import { categories } from "@/db/schema/categories";
import { productCategories } from "@/db/schema/productCategories";
import { products } from "@/db/schema/products";
import { eq } from "drizzle-orm";

// توجه: این تابع فقط اسلاگ را در جدول projects چک می‌کند.
// برای دسته‌بندی‌ها و محصولات از توابع اختصاصی زیر استفاده کنید،
// چون هرکدام باید در جدول خودشان بررسی شوند نه در projects.
export async function generateUniqueSlug(title: string): Promise<string> {
  const baseSlug = slugify(title, { lower: true, strict: true, locale: "fa" });
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

export async function generateUniqueCategorySlug(
  title: string,
): Promise<string> {
  const baseSlug = slugify(title, { lower: true, strict: true, locale: "fa" });
  let uniqueSlug = baseSlug;
  let counter = 1;

  while (true) {
    const exists = await db.query.categories.findFirst({
      where: eq(categories.slug, uniqueSlug),
    });

    if (!exists) break;

    uniqueSlug = `${baseSlug}-${counter++}`;
  }

  return uniqueSlug;
}

export async function generateUniqueProductCategorySlug(
  title: string,
): Promise<string> {
  const baseSlug = slugify(title, { lower: true, strict: true, locale: "fa" });
  let uniqueSlug = baseSlug;
  let counter = 1;

  while (true) {
    const exists = await db.query.productCategories.findFirst({
      where: eq(productCategories.slug, uniqueSlug),
    });

    if (!exists) break;

    uniqueSlug = `${baseSlug}-${counter++}`;
  }

  return uniqueSlug;
}

export async function generateUniqueProductSlug(
  title: string,
): Promise<string> {
  const baseSlug = slugify(title, { lower: true, strict: true, locale: "fa" });
  let uniqueSlug = baseSlug;
  let counter = 1;

  while (true) {
    const exists = await db.query.products.findFirst({
      where: eq(products.slug, uniqueSlug),
    });

    if (!exists) break;

    uniqueSlug = `${baseSlug}-${counter++}`;
  }

  return uniqueSlug;
}

export async function generateUniqueSeoSlug(input: string): Promise<string> {
  const baseSlug = input; // ⚠️ متن وارد شده رو دست نزن
  let uniqueSlug = baseSlug;
  let counter = 1;

  while (true) {
    const exists = await db
      .select()
      .from(projects)
      .where(eq(projects.seoSlug, uniqueSlug))
      .limit(1);

    if (exists.length === 0) break;

    uniqueSlug = `${baseSlug}-${counter++}`;
  }

  return uniqueSlug;
}
