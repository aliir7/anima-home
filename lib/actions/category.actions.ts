"use server";

import { db } from "@/db";
import { categories } from "@/db/schema/categories";
import { randomUUID } from "crypto";
import slugify from "slugify";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { ActionResult, Category, InsertCategoryValues } from "@/types";
import { insertCategorySchema } from "../validations/categoryValidations";

// Action for create category
export async function createCategoryAction(
  data: InsertCategoryValues,
): Promise<ActionResult<Category>> {
  try {
    const validated = insertCategorySchema.safeParse(data);
    if (!validated.success) {
      return {
        success: false,
        error: {
          type: "zod",
          issues: validated.error.issues,
        },
      };
    }

    const { name, parentName } = validated.data;
    let parentId: string | null = null;

    const slug = slugify(name, {
      lower: true,
      strict: true,
      locale: "fa",
    });

    // جلوگیری از تکرار دسته‌بندی با همان slug
    const [existing] = await db
      .select()
      .from(categories)
      .where(eq(categories.slug, slug));
    if (existing) {
      return {
        success: false,
        error: {
          type: "custom",
          message: "دسته‌بندی با این نام قبلاً وجود دارد.",
        },
      };
    }

    // بررسی و ایجاد مقدار والد
    if (parentName && parentName.trim() !== "") {
      const parentSlug = slugify(parentName, {
        lower: true,
        strict: true,
        locale: "fa",
      });

      const [existingParent] = await db
        .select()
        .from(categories)
        .where(eq(categories.slug, parentSlug));

      if (existingParent) {
        parentId = existingParent.id;
      } else {
        parentId = randomUUID(); // ✅ ساخت uuid جدید برای والد
        await db.insert(categories).values({
          id: parentId,
          name: parentName,
          slug: parentSlug,
        });
      }
    }

    const [newCategory] = await db
      .insert(categories)
      .values({
        name,
        slug,
        parentId,
        parentName: parentName || null,
      })
      .returning();

    revalidatePath("/admin/categories");

    return {
      success: true,
      data: newCategory,
    };
  } catch (error) {
    console.error("Create category error:", error);
    return {
      success: false,
      error: {
        type: "custom",
        message: "خطایی در ایجاد دسته‌بندی رخ داد.",
      },
    };
  }
}

// Action for update category
export async function updateCategoryAction(
  data: InsertCategoryValues & { id: string },
): Promise<ActionResult<string>> {
  try {
    const validated = insertCategorySchema.safeParse(data);

    if (!validated.success) {
      return {
        success: false,
        error: {
          type: "zod",
          issues: validated.error.issues,
        },
      };
    }

    const { id, name, parentName } = { ...validated.data, id: data.id };

    const slug = slugify(name, {
      lower: true,
      strict: true,
      locale: "fa",
    });

    // بررسی تکراری نبودن نام (به جز خود رکورد فعلی)
    const [existing] = await db
      .select()
      .from(categories)
      .where(eq(categories.slug, slug));

    if (existing && existing.id !== id) {
      return {
        success: false,
        error: {
          type: "custom",
          message: "دسته‌بندی دیگری با این نام وجود دارد.",
        },
      };
    }

    await db
      .update(categories)
      .set({
        name,
        slug,
        parentName: parentName?.trim() || null,
        parentId: parentName?.trim() ? crypto.randomUUID() : null,
      })
      .where(eq(categories.id, id));

    revalidatePath("/admin/categories");

    return {
      success: true,
      data: "دسته‌بندی با موفقیت ویرایش شد",
    };
  } catch (error) {
    console.error("Update category error:", error);
    return {
      success: false,
      error: {
        type: "custom",
        message: "خطایی در ویرایش دسته‌بندی رخ داد.",
      },
    };
  }
}

// Action for delete category
export async function deleteCategoryAction(
  id: string,
): Promise<ActionResult<string>> {
  try {
    // check for category exist or not
    const [existing] = await db
      .select()
      .from(categories)
      .where(eq(categories.id, id));

    if (!existing) {
      return {
        success: false,
        error: {
          type: "custom",
          message: "دسته‌بندی مورد نظر یافت نشد.",
        },
      };
    }

    // deleting category from database
    await db.delete(categories).where(eq(categories.id, id));

    // update page with fresh data
    revalidatePath("/admin/categories");

    return {
      success: true,
      data: "دسته بندی با موفقیت حذف شد",
    };
  } catch (error) {
    console.error("Delete category error:", error);
    return {
      success: false,
      error: {
        type: "custom",
        message: "خطایی در حذف دسته‌بندی رخ داد.",
      },
    };
  }
}
