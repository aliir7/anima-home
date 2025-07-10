"use server";

import { db } from "@/db";
import { categories } from "@/db/schema/categories";

import slugify from "slugify";
import { eq, and, ne } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import {
  ActionResult,
  Category,
  InsertCategoryValues,
  UpdateCategoryValues,
} from "@/types";
import {
  insertCategorySchema,
  updateCategorySchema,
} from "../validations/categoryValidations";

// Action for create category
export async function createCategoryAction(
  data: InsertCategoryValues,
): Promise<ActionResult<Category>> {
  try {
    // validation input data for create
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

    const { name, parentId } = validated.data;

    // generate slug
    const slug = slugify(name, {
      lower: true,
      strict: true,
      locale: "fa",
    });

    // checking for duplicate name
    const [existing] = await db
      .select()
      .from(categories)
      .where(eq(categories.name, name));

    if (existing) {
      return {
        success: false,
        error: {
          type: "custom",
          message: "دسته‌بندی با این نام از قبل وجود دارد.",
        },
      };
    }

    const [newCategory] = await db
      .insert(categories)
      .values({
        name,
        slug,
        parentId: parentId || null,
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
  data: UpdateCategoryValues,
): Promise<ActionResult<Category>> {
  try {
    // validation input data for update
    const validated = updateCategorySchema.safeParse(data);
    if (!validated.success) {
      return {
        success: false,
        error: {
          type: "zod",
          issues: validated.error.issues,
        },
      };
    }

    const { id, name, parentId } = validated.data;

    // generate slug from category name
    const newSlug = slugify(name, {
      lower: true,
      strict: true,
      locale: "fa",
    });

    // checking for duplicate category
    const [conflict] = await db
      .select()
      .from(categories)
      .where(and(eq(categories.slug, newSlug), ne(categories.id, id)));

    if (conflict) {
      return {
        success: false,
        error: {
          type: "custom",
          message: "دسته‌بندی دیگری با این نام وجود دارد.",
        },
      };
    }

    // update category on database
    const [updated] = await db
      .update(categories)
      .set({
        name,
        slug: newSlug,
        parentId: parentId || null,
      })
      .where(eq(categories.id, id))
      .returning();

    revalidatePath("/admin/categories");

    return { success: true, data: updated };
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
