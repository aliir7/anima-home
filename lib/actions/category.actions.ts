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
import { isValidUUID } from "../validations/uuidValidation";

// Action for create category
export async function createCategoryAction(
  data: InsertCategoryValues,
): Promise<ActionResult<Category>> {
  try {
    // اعتبارسنجی اولیه
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

    const { name } = validated.data;
    let { parentId } = validated.data;

    const slug = slugify(name, {
      lower: true,
      strict: true,
      locale: "fa",
    });

    // جلوگیری از ایجاد دسته تکراری
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

    if (parentId && parentId === name) {
      return {
        success: false,
        error: {
          type: "custom",
          message: "نام والد نمی‌تواند با نام دسته‌بندی برابر باشد.",
        },
      };
    }

    // اگر parentId وارد شده اما uuid نبود، یعنی نام وارد شده
    if (parentId && !isValidUUID(parentId)) {
      const parentSlug = slugify(parentId, {
        lower: true,
        strict: true,
        locale: "fa",
      });

      // بررسی وجود دسته والد با همین slug
      const [existingParent] = await db
        .select()
        .from(categories)
        .where(eq(categories.slug, parentSlug));

      if (existingParent) {
        parentId = existingParent.id;
      } else {
        const [newParent] = await db
          .insert(categories)
          .values({ name: parentId, slug: parentSlug })
          .returning();
        parentId = newParent.id;
      }
    }

    // ایجاد دسته‌بندی نهایی
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
