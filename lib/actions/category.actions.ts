"use server";

import { db } from "@/db";
import { categories } from "@/db/schema/categories";
import slugify from "slugify";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { ActionResult, Category, InsertCategoryValues } from "@/types";
import { insertCategorySchema } from "../validations/categoryValidations";
import { generateUniqueCategorySlug } from "../utils/generateSlug";
import { requireAdmin } from "../auth/authGuard";

// Action for create category
export async function createCategoryAction(
  data: InsertCategoryValues,
): Promise<ActionResult<Category>> {
  try {
    // 🔒 این عملیات فقط برای ادمین مجاز است
    await requireAdmin();

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

    // بررسی تکراری نبودن دسته (بر اساس نام)
    const [existingByName] = await db
      .select()
      .from(categories)
      .where(eq(categories.name, name));

    if (existingByName) {
      return {
        success: false,
        error: {
          type: "custom",
          message: "دسته‌بندی با این نام قبلاً وجود دارد.",
        },
      };
    }

    // جلوگیری از والد شدن خودش
    if (parentName && parentName.trim() === name.trim()) {
      return {
        success: false,
        error: {
          type: "custom",
          message: "نام والد نمی‌تواند با نام دسته‌بندی یکی باشد.",
        },
      };
    }

    // ایجاد دسته جدید (به همراه ساخت واقعی والد در صورت نیاز) در یک تراکنش
    const newCategory = await db.transaction(async (tx) => {
      let parentId: string | null = null;
      let finalParentName: string | null = null;

      if (parentName && parentName.trim() !== "") {
        const trimmedParentName = parentName.trim();
        const [existingParent] = await tx
          .select()
          .from(categories)
          .where(eq(categories.name, trimmedParentName));

        if (existingParent) {
          parentId = existingParent.id;
          finalParentName = existingParent.name;
        } else {
          // والد وجود ندارد → واقعاً یک ردیف برایش بساز، نه یک UUID ساختگی
          const newParentSlug =
            await generateUniqueCategorySlug(trimmedParentName);
          const [createdParent] = await tx
            .insert(categories)
            .values({
              name: trimmedParentName,
              slug: newParentSlug,
            })
            .returning();

          parentId = createdParent.id;
          finalParentName = createdParent.name;
        }
      }

      const slug = await generateUniqueCategorySlug(name);

      const [inserted] = await tx
        .insert(categories)
        .values({
          name,
          slug,
          parentId,
          parentName: finalParentName,
        })
        .returning();

      return inserted;
    });

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
    // 🔒 این عملیات فقط برای ادمین مجاز است
    await requireAdmin();

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

    // جلوگیری از والد شدن خودش
    if (parentName && parentName.trim() === name.trim()) {
      return {
        success: false,
        error: {
          type: "custom",
          message: "نام والد نمی‌تواند با نام دسته‌بندی یکی باشد.",
        },
      };
    }

    await db.transaction(async (tx) => {
      let parentId: string | null = null;
      let finalParentName: string | null = null;
      const trimmedParentName = parentName?.trim() || "";

      if (trimmedParentName) {
        const [existingParent] = await tx
          .select()
          .from(categories)
          .where(eq(categories.name, trimmedParentName));

        if (existingParent) {
          parentId = existingParent.id;
          finalParentName = existingParent.name;
        } else {
          const newParentSlug =
            await generateUniqueCategorySlug(trimmedParentName);
          const [createdParent] = await tx
            .insert(categories)
            .values({
              name: trimmedParentName,
              slug: newParentSlug,
            })
            .returning();

          parentId = createdParent.id;
          finalParentName = createdParent.name;
        }
      }

      await tx
        .update(categories)
        .set({
          name,
          slug,
          parentName: finalParentName,
          parentId,
        })
        .where(eq(categories.id, id));
    });

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
    // 🔒 این عملیات فقط برای ادمین مجاز است
    await requireAdmin();

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
