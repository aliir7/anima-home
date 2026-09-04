"use server";

import { db } from "@/db";
import { reviews, orders, orderItems, products } from "@/db/schema";
import { and, desc, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { ActionResult, ReviewWithUser } from "@/types";
import { getCurrentSession } from "../auth/authGuard";
import { createReviewSchema } from "../validations/reviewValidations";
import { formatError } from "../utils/formatError";

const REVIEWS_PAGE_SIZE = 5;

// =================================================================
// بررسی اینکه آیا کاربر جاری اجازه‌ی ثبت نظر برای این محصول را دارد
// (لاگین + خرید تایید‌شده + هنوز نظر نداده)
// =================================================================
export async function getReviewEligibility(productId: string): Promise<{
  canReview: boolean;
  reason?: "NOT_LOGGED_IN" | "NOT_PURCHASED" | "ALREADY_REVIEWED";
}> {
  const session = await getCurrentSession();
  if (!session?.user?.id) {
    return { canReview: false, reason: "NOT_LOGGED_IN" };
  }

  const existingReview = await db.query.reviews.findFirst({
    where: and(
      eq(reviews.userId, session.user.id),
      eq(reviews.productId, productId),
    ),
    columns: { id: true },
  });
  if (existingReview) {
    return { canReview: false, reason: "ALREADY_REVIEWED" };
  }

  const hasPurchased = await userHasPurchasedProduct(
    session.user.id,
    productId,
  );
  if (!hasPurchased) {
    return { canReview: false, reason: "NOT_PURCHASED" };
  }

  return { canReview: true };
}

async function userHasPurchasedProduct(userId: string, productId: string) {
  const [purchase] = await db
    .select({ orderId: orderItems.orderId })
    .from(orderItems)
    .innerJoin(orders, eq(orderItems.orderId, orders.id))
    .where(
      and(
        eq(orderItems.productId, productId),
        eq(orders.userId, userId),
        eq(orders.isPaid, true),
      ),
    )
    .limit(1);

  return !!purchase;
}

// =================================================================
// ثبت نظر جدید
// =================================================================
export async function createReview(input: {
  productId: string;
  rating: number;
  comment?: string;
}): Promise<ActionResult<string>> {
  try {
    const session = await getCurrentSession();
    if (!session?.user?.id) {
      return {
        success: false,
        error: { type: "custom", message: "لطفا ابتدا وارد حساب کاربری شوید" },
      };
    }

    const validated = createReviewSchema.safeParse(input);
    if (!validated.success) {
      return {
        success: false,
        error: { type: "zod", issues: validated.error.issues },
      };
    }
    const { productId, rating, comment } = validated.data;

    // 🔒 هرگز به چک سمت کلاینت اعتماد نمی‌کنیم — همینجا دوباره تایید
    // می‌کنیم که این کاربر واقعاً این محصول را خریده است
    const hasPurchased = await userHasPurchasedProduct(
      session.user.id,
      productId,
    );
    if (!hasPurchased) {
      return {
        success: false,
        error: {
          type: "custom",
          message: "فقط خریداران این محصول می‌توانند نظر ثبت کنند",
        },
      };
    }

    await db.transaction(async (tx) => {
      // constraint یکتای (userId, productId) خودش از ثبت نظر تکراری جلوگیری
      // می‌کند — اگر کاربر قبلاً نظر داده باشد، همینجا خطا پرتاب می‌شود
      await tx.insert(reviews).values({
        productId,
        userId: session.user.id,
        rating,
        comment: comment || null,
      });

      await recalculateProductRating(tx, productId);
    });

    revalidatePath(`/shop/products`);

    return { success: true, data: "نظر شما با موفقیت ثبت شد" };
  } catch (error) {
    // خطای unique constraint (کد 23505 پستگرس) یعنی کاربر قبلاً نظر داده
    const isDuplicate =
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code?: string }).code === "23505";

    return {
      success: false,
      error: {
        type: "custom",
        message: isDuplicate
          ? "شما قبلاً برای این محصول نظر ثبت کرده‌اید"
          : "خطایی در ثبت نظر رخ داد",
      },
    };
  }
}

// =================================================================
// حذف نظر — توسط نویسنده‌ی خودش یا ادمین
// =================================================================
export async function deleteReview(
  reviewId: string,
): Promise<ActionResult<string>> {
  try {
    const session = await getCurrentSession();
    if (!session?.user?.id) {
      return {
        success: false,
        error: { type: "custom", message: "لطفا ابتدا وارد حساب کاربری شوید" },
      };
    }

    const review = await db.query.reviews.findFirst({
      where: eq(reviews.id, reviewId),
    });
    if (!review) {
      return {
        success: false,
        error: { type: "custom", message: "نظر یافت نشد" },
      };
    }

    // 🔒 فقط نویسنده‌ی نظر یا ادمین اجازه‌ی حذف دارد
    const isOwner = review.userId === session.user.id;
    const isAdmin = session.user.role === "admin";
    if (!isOwner && !isAdmin) {
      return {
        success: false,
        error: { type: "custom", message: "شما اجازه‌ی حذف این نظر را ندارید" },
      };
    }

    await db.transaction(async (tx) => {
      await tx.delete(reviews).where(eq(reviews.id, reviewId));
      await recalculateProductRating(tx, review.productId);
    });

    revalidatePath(`/shop/products`);

    return { success: true, data: "نظر حذف شد" };
  } catch (error) {
    return {
      success: false,
      error: { type: "custom", message: formatError(error) },
    };
  }
}

// =================================================================
// دریافت نظرات یک محصول (صفحه‌بندی‌شده)
// =================================================================
export async function getProductReviews(
  productId: string,
  page = 1,
): Promise<ActionResult<{ reviews: ReviewWithUser[]; hasMore: boolean }>> {
  try {
    const offset = (page - 1) * REVIEWS_PAGE_SIZE;

    const rows = await db.query.reviews.findMany({
      where: eq(reviews.productId, productId),
      orderBy: [desc(reviews.createdAt)],
      limit: REVIEWS_PAGE_SIZE + 1, // یکی بیشتر می‌گیریم تا بفهمیم صفحه‌ی بعدی هست یا نه
      offset,
      with: {
        user: { columns: { name: true } },
      },
    });

    const hasMore = rows.length > REVIEWS_PAGE_SIZE;

    return {
      success: true,
      data: {
        reviews: rows.slice(0, REVIEWS_PAGE_SIZE),
        hasMore,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: { type: "custom", message: formatError(error) },
    };
  }
}

// =================================================================
// محاسبه‌ی مجدد میانگین امتیاز و تعداد نظرات یک محصول
// =================================================================
async function recalculateProductRating(
  tx: Parameters<Parameters<typeof db.transaction>[0]>[0],
  productId: string,
) {
  const [stats] = await tx
    .select({
      avgRating: sql<string>`COALESCE(ROUND(AVG(${reviews.rating})::numeric, 1), 0)`,
      count: sql<number>`COUNT(*)`,
    })
    .from(reviews)
    .where(eq(reviews.productId, productId));

  await tx
    .update(products)
    .set({
      rating: stats.avgRating,
      numReviews: Number(stats.count),
    })
    .where(eq(products.id, productId));
}
