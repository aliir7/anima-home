"use server";

import {
  ActionResult,
  createProductValues,
  InsertCategoryValues,
} from "@/types";
import { formatError } from "../utils/formatError";
import { createProductSchema } from "../validations/productValidation";
import { db } from "@/db";
import {
  categories,
  productCategories,
  products,
  productVariants,
} from "@/db/schema";
import { eq } from "drizzle-orm";
import { generateUniqueSlug } from "../utils/generateSlug";
import { revalidatePath } from "next/cache";
import { insertCategorySchema } from "../validations/categoryValidations";
import { randomUUID } from "crypto";

export async function createProductCategory(
  data: InsertCategoryValues,
): Promise<ActionResult<unknown>> {
  try {
    const validation = insertCategorySchema.safeParse(data);
    if (!validation.success) {
      return {
        success: false,
        error: {
          type: "zod",
          issues: validation.error.issues,
        },
      };
    }
    const { name, parentName } = validation.data;

    // generate slug
    const slug = await generateUniqueSlug(name);

    // بررسی تکراری نبودن دسته
    const [existing] = await db
      .select()
      .from(productCategories)
      .where(eq(productCategories.slug, slug));

    if (existing) {
      return {
        success: false,
        error: {
          type: "custom",
          message: formatError("دسته‌بندی با این نام قبلاً وجود دارد."),
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

    // بررسی وجود والد
    let parentId: string | null = null;
    let finalParentName: string | null = null;

    if (parentName && parentName.trim() !== "") {
      const parentSlug = await generateUniqueSlug(parentName);

      const [existingParent] = await db
        .select()
        .from(productCategories)
        .where(eq(productCategories.slug, parentSlug));

      if (existingParent) {
        parentId = existingParent.id;
        finalParentName = existingParent.name;
      } else {
        // اگر وجود نداشت، فقط نام والد رو ذخیره می‌کنیم، ولی خودش رو insert نمی‌کنیم
        parentId = randomUUID();
        finalParentName = parentName;
      }
    }

    // ایجاد دسته جدید
    const [newCategory] = await db
      .insert(productCategories)
      .values({
        name,
        slug,
        parentId,
        parentName: finalParentName,
      })
      .returning();

    revalidatePath("/admin/categories");

    return {
      success: true,
      data: newCategory,
    };
  } catch (err) {
    return {
      success: false,
      error: {
        type: "custom",
        message: formatError(err),
      },
    };
  }
}

// create product
export async function createProductAction(
  data: createProductValues,
): Promise<ActionResult<unknown>> {
  try {
    // get data & validations
    const validation = createProductSchema.safeParse(data);

    if (!validation.success) {
      return {
        success: false,
        error: {
          type: "zod",
          issues: validation.error.issues,
        },
      };
    }
    // if validation is pass
    const {
      title,
      brand,
      seoSlug,
      categoryId,
      description,
      sku,
      price,
      stock,
      specs,
      images,
    } = validation.data;
    // checking new project not duplicated
    const [existing] = await db
      .select()
      .from(products)
      .where(eq(products.title, title));

    if (existing) {
      return {
        success: false,
        error: {
          type: "custom",
          message: formatError("محصول با این عنوان از قبل وجود دارد"),
        },
      };
    }
    // چک کردن یکتا بودن seoSlug
    const [existingSeo] = await db
      .select()
      .from(products)
      .where(eq(products.seoSlug, seoSlug));

    if (existingSeo) {
      return {
        success: false,
        error: {
          type: "custom",
          message: formatError("این SEO Slug قبلا استفاده شده است"),
        },
      };
    }
    // generate slug
    const slug = await generateUniqueSlug(title);

    // تبدیل آرایه ویژگی‌ها به آبجکت برای ذخیره در JSONB
    const specsObject = specs.reduce(
      (acc, curr) => {
        if (curr.key && curr.value) acc[curr.key] = curr.value;
        return acc;
      },
      {} as Record<string, string>,
    );

    // create new product to database
    await db.transaction(async (tx) => {
      // ایجاد محصول والد
      const [newProduct] = await tx
        .insert(products)
        .values({
          categoryId,
          title,
          brand,
          slug,
          seoSlug,
          description,
          isActive: true,
          rating: "0.0",
          numReviews: 0,
        })
        .returning({ id: products.id });

      // ایجاد واریانت
      await tx.insert(productVariants).values({
        productId: newProduct.id,
        sku,
        title, // معمولاً تایتل واریانت همان تایتل محصول است مگر رنگ/سایز داشته باشد
        price,
        stock,
        specs: specsObject,
        images,
        isActive: true,
      });
    });

    revalidatePath("/admin/products");
    return { success: true, data: { message: "محصول با موفقیت ایجاد شد" } };
  } catch (err) {
    console.error("Create Product Error:", err);
    return {
      success: false,
      error: {
        type: "custom",
        message: formatError(err),
      },
    };
  }
}
