import { ActionResult, ProductWithRelations, QueryResult } from "@/types";
import { db } from "..";
import { eq, sql } from "drizzle-orm";
import { products } from "../schema";
import { formatError } from "@/lib/utils/formatError";

type GetAllProductsParams = {
  page?: number;
  pageSize?: number;
  categoryId?: string;
};

export async function getAllProducts({
  page = 1,
  pageSize = 10,
  categoryId,
}: GetAllProductsParams): Promise<ActionResult<ProductWithRelations[]>> {
  try {
    const offset = (page - 1) * pageSize;

    const data = await db.query.products.findMany({
      // شرط داینامیک: اگر categoryId وجود داشت، فیلتر کن
      where: categoryId ? eq(products.categoryId, categoryId) : undefined,

      // بخش کلیدی: واکشی روابط (Relations)
      with: {
        // تمام واریانت‌های مرتبط با این محصول را بیاور
        variants: true,
        // دسته‌بندی مرتبط با این محصول و والد آن دسته‌بندی را هم بیاور
        category: {
          with: {
            parent: true,
          },
        },
      },

      orderBy: (product, { desc }) => [desc(product.createdAt)],
      limit: pageSize,
      offset,
    });

    const normalizedData: ProductWithRelations[] = data.map((product) => ({
      ...product,

      variants: product.variants.map((variant) => ({
        ...variant,

        specs: (variant.specs ?? {}) as Record<string, string>,
        images: (variant.images ?? []) as string[],
      })),
    }));

    return { success: true, data: normalizedData };
  } catch (error) {
    console.error("Error in getAllProducts:", error);
    return {
      success: false,
      error: { type: "custom", message: formatError(error) }, // از تابع خودمان برای فرمت خطا استفاده می‌کنیم
    };
  }
}

/**
 * @description تعداد کل محصولات را (با قابلیت فیلتر بر اساس دسته‌بندی) برمی‌گرداند.
 * این تابع برای محاسبه تعداد کل صفحات (Pagination) ضروری است.
 */
export async function getProductsCount(categoryId?: string): Promise<number> {
  try {
    const whereClause = categoryId
      ? eq(products.categoryId, categoryId)
      : undefined;

    const result = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(products)
      .where(whereClause);

    // اطمینان از اینکه همیشه یک عدد برمی‌گردد
    return Number(result[0]?.count ?? 0);
  } catch (error) {
    console.error("Error in getProductsCount:", error);
    return 0; // در صورت خطا، صفر برمی‌گردانیم تا برنامه کرش نکند
  }
}

export async function getProductBySlug(
  seoSlug: string,
): Promise<ActionResult<ProductWithRelations | null>> {
  try {
    const product = await db.query.products.findFirst({
      where: eq(products.seoSlug, seoSlug),

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
    console.error("Error in getProductBySlug:", error);
    return {
      success: false,
      error: {
        type: "custom",
        message: formatError(error),
      },
    };
  }
}
