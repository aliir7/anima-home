"use server";

import {
  ActionResult,
  createProductValues,
  InsertCategoryValues,
  ProductWithRelations,
  updateProductValues,
} from "@/types";
import { formatError } from "../utils/formatError";
import {
  createProductSchema,
  updateProductSchema,
} from "../validations/productValidation";
import { db } from "@/db";
import {
  categories,
  productCategories,
  products,
  productVariants,
} from "@/db/schema";
import { and, eq, ne } from "drizzle-orm";
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

// =================================================================
// UPDATE PRODUCT ACTION
// =================================================================

export async function updateProductAction(
  productId: string,
  data: updateProductValues,
): Promise<ActionResult<unknown>> {
  try {
    // 1. اعتبارسنجی داده‌های ورودی
    const validation = updateProductSchema.safeParse(data);
    if (!validation.success) {
      return {
        success: false,
        error: { type: "zod", issues: validation.error.issues },
      };
    }

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

    // 2. بررسی وجود محصول
    const [productToUpdate] = await db
      .select({ id: products.id })
      .from(products)
      .where(eq(products.id, productId));

    if (!productToUpdate) {
      return {
        success: false,
        error: {
          type: "custom",
          message: formatError("محصولی برای ویرایش یافت نشد"),
        },
      };
    }

    // 3. بررسی یکتا بودن عنوان (در صورت تغییر)
    // این قسمت علت اصلی خطا بود. با این validation، title دیگر undefined نیست.
    const [existingTitle] = await db
      .select()
      .from(products)
      .where(and(eq(products.title, title!), ne(products.id, productId)));

    if (existingTitle) {
      return {
        success: false,
        error: {
          type: "custom",
          message: formatError("محصول دیگری با این عنوان وجود دارد"),
        },
      };
    }

    // 4. بررسی یکتا بودن SEO Slug (در صورت تغییر)
    const [existingSeo] = await db
      .select()
      .from(products)
      .where(and(eq(products.seoSlug, seoSlug!), ne(products.id, productId)));

    if (existingSeo) {
      return {
        success: false,
        error: {
          type: "custom",
          message: formatError("این SEO Slug قبلا استفاده شده است"),
        },
      };
    }

    // 5. تبدیل ویژگی‌ها به آبجکت JSON
    const specsArray = specs || [];
    const specsObject = specsArray.reduce(
      (acc, curr) => {
        if (curr.key && curr.value) acc[curr.key] = curr.value;
        return acc;
      },
      {} as Record<string, string>,
    );

    // 6. اجرای تراکنش برای آپدیت محصول و واریانت
    await db.transaction(async (tx) => {
      // آپدیت جدول اصلی محصولات
      // متد set در Drizzle به صورت هوشمند مقادیر undefined را نادیده می‌گیرد
      await tx
        .update(products)
        .set({
          title,
          brand,
          seoSlug,
          categoryId,
          description,
        })
        .where(eq(products.id, productId));

      // آپدیت جدول واریانت‌ها
      await tx
        .update(productVariants)
        .set({
          sku,
          title, // عنوان واریانت نیز آپدیت می‌شود
          price,
          stock,
          specs: specsObject,
          images,
        })
        .where(eq(productVariants.productId, productId));
    });

    revalidatePath("/admin/products");
    revalidatePath(`shop/products/${seoSlug}`);

    return { success: true, data: { message: "محصول با موفقیت ویرایش شد" } };
  } catch (err) {
    console.error("Update Product Error:", err);
    return {
      success: false,
      error: {
        type: "custom",
        message: formatError(err),
      },
    };
  }
}

// =================================================================
// DELETE PRODUCT ACTION - COMPLETED
// =================================================================
export async function deleteProductAction(
  productId: string,
): Promise<ActionResult<unknown>> {
  try {
    if (!productId) {
      return {
        success: false,
        error: {
          type: "custom",
          message: formatError("شناسه محصول نامعتبر است"),
        },
      };
    }

    // 1. یافتن تمام واریانت‌های محصول برای استخراج آدرس فایل‌ها
    const variantsToDelete = await db
      .select({ images: productVariants.images })
      .from(productVariants)
      .where(eq(productVariants.productId, productId));

    // 2. تجمیع تمام لینک‌های تصاویر از همه واریانت‌ها
    const allImageUrls = variantsToDelete.flatMap((variant) =>
      Array.isArray(variant.images) ? variant.images : [],
    );

    // 3. حذف فایل‌ها از فضای ابری (Storage)
    const BUCKET_URL = "https://anima-home.storage.c2.liara.space/";
    const extractKey = (url: string) => url.replace(BUCKET_URL, "");

    const fileKeys = allImageUrls
      .filter(
        (url): url is string =>
          typeof url === "string" && url.startsWith(BUCKET_URL),
      )
      .map(extractKey);

    if (fileKeys.length > 0) {
      const res = await fetch(
        // اطمینان حاصل کنید که این متغیر محیطی در سرور شما تعریف شده است
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/storage/delete`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ keys: fileKeys }),
        },
      );

      // اگر حذف فایل‌ها با خطا مواجه شد، عملیات را متوقف می‌کنیم تا رکورد دیتابیس باقی بماند
      if (!res.ok) {
        const result = await res.json();
        console.error("File Deletion Error:", result);
        throw new Error(result.error || "خطا در حذف فایل‌ها از فضای ابری");
      }
    }

    // 4. حذف رکورد از دیتابیس
    // نکته مهم: این کد فرض می‌کند که در تعریف schema شما برای جدول productVariants
    // روی ستون productId یک foreign key با onDelete: 'cascade' تعریف شده است.
    // این باعث می‌شود با حذف محصول، تمام واریانت‌های مرتبط با آن نیز خودکار حذف شوند.
    await db.delete(products).where(eq(products.id, productId));

    // 5. پاک کردن کش و بازگشت پیام موفقیت
    revalidatePath("/admin/products");
    return { success: true, data: { message: "محصول با موفقیت حذف شد" } };
  } catch (err) {
    console.error("Delete Product Error:", err);
    return {
      success: false,
      error: {
        type: "custom",
        message: formatError(err),
      },
    };
  }
}

// =================================================================
// UPDATE PRODUCT ACTION
// =================================================================

export async function getProductById(
  productId: string,
): Promise<ActionResult<ProductWithRelations | null>> {
  try {
    const product = await db.query.products.findFirst({
      where: eq(products.id, productId),

      with: {
        variants: true,
        category: {
          with: {
            parent: true,
          },
        },
      },
    });

    if (!product) {
      return {
        success: false,
        error: {
          type: "custom",
          message: formatError("محصولی یافت نشد"),
        },
      };
    }

    const normalizedProduct: ProductWithRelations = {
      ...product,

      variants: product.variants.map((variant) => ({
        ...variant,

        specs: (variant.specs ?? {}) as Record<string, string>,
        images: (variant.images ?? []) as string[],
      })),
    };
    return {
      success: true,
      data: normalizedProduct ?? null,
    };
  } catch (error) {
    console.error("Error in getProductById:", error);
    return {
      success: false,
      error: {
        type: "custom",
        message: formatError(error),
      },
    };
  }
}
