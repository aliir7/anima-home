import { ActionResult, ProductWithRelations, QueryResult } from "@/types";
import { db } from "..";
import { asc, desc, eq, sql } from "drizzle-orm";
import { products, productVariants } from "../schema";
import { formatError } from "@/lib/utils/formatError";
import { PAGE_SIZE } from "@/lib/constants";

type GetAllProductsParams = {
  page?: number;
  pageSize?: number;
  categoryId?: string;
  sort?: string;
};

export async function getAllProducts({
  page = 1,
  pageSize = PAGE_SIZE,
  categoryId,
  sort,
}: GetAllProductsParams): Promise<ActionResult<ProductWithRelations[]>> {
  try {
    const offset = (page - 1) * pageSize;

    // --- ساخت منطق مرتب‌سازی با SQL Subquery ---
    let orderBySql;

    // این ساب‌کوئری می‌گوید: کمترین قیمت را از جدول واریانت‌ها برای محصول جاری پیدا کن
    const minPriceSubQuery = sql`(
      SELECT MIN(${productVariants.price}) 
      FROM ${productVariants} 
      WHERE ${productVariants.productId} = ${products.id}
    )`;

    switch (sort) {
      case "price-asc":
        // مرتب‌سازی صعودی بر اساس کمترین قیمت محاسبه شده
        orderBySql = sql`${minPriceSubQuery} ASC`;
        break;
      case "price-desc":
        // مرتب‌سازی نزولی بر اساس کمترین قیمت محاسبه شده
        orderBySql = sql`${minPriceSubQuery} DESC`;
        break;
      case "oldest":
        orderBySql = asc(products.createdAt);
        break;
      case "latest":
      default:
        orderBySql = desc(products.createdAt);
        break;
    }
    // -------------------------------------

    const data = await db.query.products.findMany({
      where: categoryId ? eq(products.categoryId, categoryId) : undefined,

      with: {
        variants: true,
        category: {
          with: {
            parent: true,
          },
        },
      },

      // اینجا آرایه پاس می‌دهیم
      orderBy: [orderBySql],

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
      error: { type: "custom", message: formatError(error) },
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
