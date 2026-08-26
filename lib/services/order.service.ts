import { db } from "@/db";
import { orders, productVariants } from "@/db/schema";
import { and, eq, gte, sql } from "drizzle-orm";
import {
  sendOrderSuccessSmsToAdmin,
  sendOrderSuccessSmsToClient,
} from "../actions/sms.actions";

export async function getOrderById(orderId: string) {
  const order = await db.query.orders.findFirst({
    where: eq(orders.id, orderId),
    with: {
      items: true,

      user: {
        columns: { name: true, email: true },
      },
    },
  });

  return order;
}

export async function updateOrderToPaid({
  orderId,
  paymentResult,
}: {
  orderId: string;
  paymentResult?: any;
}) {
  const order = await db.query.orders.findFirst({
    where: eq(orders.id, orderId),
    with: { items: true },
  });

  if (!order) throw new Error("سفارش پیدا نشد");
  if (order.isPaid) throw new Error("این سفارش قبلا پرداخت شده است");

  await db.transaction(async (tx) => {
    // 1. کسر موجودی محصولات
    for (const item of order.items) {
      if (item.variantId) {
        // آپدیت موجودی به شرطی که موجودی فعلی از تعداد درخواستی بیشتر یا مساوی باشد
        const updatedVariant = await tx
          .update(productVariants)
          .set({
            stock: sql`${productVariants.stock} - ${item.qty}`,
          })
          .where(
            and(
              eq(productVariants.id, item.variantId),
              gte(productVariants.stock, item.qty), // بررسی اینکه موجودی کافی است
            ),
          )
          .returning({ id: productVariants.id }); // خروجی گرفتن برای بررسی موفقیت‌آمیز بودن

        // اگر آپدیت انجام نشود (یعنی رکورد با آن آیدی پیدا نشد یا موجودی کافی نبود)، آرایه خالی برمی‌گردد
        if (updatedVariant.length === 0) {
          throw new Error(
            `موجودی برای محصول "${item.name || "نامشخص"}" کافی نیست.`,
          );
          // پرتاب این ارور باعث می‌شود کل Transaction متوقف (Rollback) شود و هیچ پولی تایید نشود.
        }
      } else {
        console.warn(
          `Item ${item.name} has no variantId and products table has no stock column.`,
        );
      }
    }
    // 2. آپدیت وضعیت سفارش
    await tx
      .update(orders)
      .set({
        isPaid: true,
        paidAt: new Date(),
        paymentResult: paymentResult,
      })
      .where(eq(orders.id, orderId));
  });

  // ارسال پیامک به کاربر و ادمین برای ثبت سفارش
  sendOrderSuccessSmsToClient(orderId);
  sendOrderSuccessSmsToAdmin(orderId);
}
