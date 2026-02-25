"use server";

import { ActionResult, CartItem, Order } from "@/types";
import { auth } from "../auth";
import { getMyCart } from "./cart.actions";
import { getUserById } from "./user.actions";
import {
  insertOrderSchema,
  shippingAddressSchema,
} from "../validations/orderValidations";
import { db } from "@/db";
import {
  carts,
  orderItems,
  orders,
  products,
  productVariants,
  users,
} from "@/db/schema";
import { count, desc, eq, sql, sum, ilike, or, and, gte } from "drizzle-orm";
import { formatError } from "../utils/formatError";
import { revalidatePath } from "next/cache";
import { createPayment } from "./payment.actions";
import { PAYMENT_METHOD } from "../constants";

// =================================================================
// 1. CREATE ORDER (ایجاد سفارش اولیه)
// =================================================================

export async function createOrder(): Promise<ActionResult<string>> {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("لطفا ابتدا وارد حساب کاربری شوید");

    const userId = session.user.id;
    const cart = await getMyCart();

    // بررسی خالی نبودن سبد خرید
    if (!cart || (cart.items as CartItem[]).length === 0) {
      return {
        success: false,
        message: "سبد خرید شما خالی است",
        error: {
          type: "custom",
          message: "سبد خرید شما خالی است",
        },
        redirectTo: "/shop/cart",
      };
    }

    const user = await getUserById(userId);
    if (!user.address) {
      return {
        success: false,
        message: "لطفا آدرس خود را تکمیل کنید",
        error: {
          type: "custom",
          message: "لطفا آدرس خود را تکمیل کنید",
        },
        redirectTo: "/shop/checkout/shipping-address",
      };
    }

    // address validations
    const addressValidationResult = shippingAddressSchema.safeParse(
      user.address,
    );
    if (!addressValidationResult.success) {
      return {
        success: false,
        message: formatError(addressValidationResult.error.issues),
        error: {
          type: "zod",
          issues: addressValidationResult.error.issues,
        },
        redirectTo: "/shop/checkout/shipping-address",
      };
    }

    const orderData = insertOrderSchema.parse({
      userId: userId, // اصلاح شد
      shippingAddress: user.address,
      paymentMethod: user.paymentMethod || PAYMENT_METHOD.ONLINE,
      itemsPrice: cart.itemsPrice,
      taxPrice: cart.taxPrice,
      totalPrice: cart.totalPrice,
    });

    // اجرای تراکنش دیتابیس (Transaction)
    const insertedOrderId = await db.transaction(async (tx) => {
      // 1. ایجاد سفارش
      const [newOrder] = await tx
        .insert(orders)
        .values(orderData)
        .returning({ id: orders.id });

      // 2. کپی کردن آیتم‌های سبد به آیتم‌های سفارش
      const orderItemsData = (cart.items as any[]).map((item) => ({
        orderId: newOrder.id,
        productId: item.productId,
        variantId: item.variantId || null, // 👈 بسیار مهم: اضافه شد
        qty: item.qty,
        price: item.price,
        name: item.name,
        slug: item.slug,
        image: item.image,
      }));

      await tx.insert(orderItems).values(orderItemsData);

      // 3. خالی کردن سبد خرید
      await tx
        .update(carts)
        .set({
          items: [],
          totalPrice: 0, // به صورت استرینگ ذخیره شود بهتر است (بستگی به نوع فیلد decimal در دیتابیس دارد)
          itemsPrice: 0,
          taxPrice: 0,
        })
        .where(eq(carts.id, cart.id));

      return newOrder.id;
    });

    return {
      success: true,
      message: "سفارش با موفقیت ایجاد شد",
      redirectTo: `/my-account/orders/order/${insertedOrderId}`,
    };
  } catch (err) {
    return {
      success: false,
      message: formatError(err),
      error: {
        type: "custom",
        message: formatError(err),
      },
    };
  }
}

// =================================================================
// 2. CREATE ORDER AND HANDLE PAYMENT (مدیریت پرداخت و هدایت نهایی)
// =================================================================
export async function createOrderAndHandlePayment(): Promise<
  ActionResult<any>
> {
  try {
    // ۱. ساخت سفارش (این مرحله دیتا را در جدول orders و orderItems ثبت می‌کند)
    const orderRes = await createOrder();

    if (!orderRes.success || !orderRes.redirectTo) {
      return {
        success: false,
        message: orderRes.message || "خطا در ایجاد سفارش اولیه",
        error:
          "error" in orderRes && orderRes.error
            ? orderRes.error
            : {
                type: "custom",
                message: orderRes.message || "خطا در ثبت سفارش",
              },
      };
    }

    // ۲. استخراج شناسه سفارش از URL بازگشتی
    // createOrder آدرس /my-account/orders/order/ID را برمی‌گرداند
    const match = orderRes.redirectTo.match(/\/order\/(.+)$/);
    const orderId = match ? match[1] : null;

    if (!orderId) {
      return {
        success: false,
        message: "شناسه سفارش یافت نشد",
        error: { type: "custom", message: "شناسه سفارش یافت نشد" },
      };
    }

    // ۳. دریافت اطلاعات کاربر برای تشخیص روش پرداخت
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        message: "کاربر یافت نشد. لطفا مجدد وارد شوید.",
        error: { type: "custom", message: "کاربر یافت نشد." },
      };
    }

    // گرفتن تازه‌ترین وضعیت کاربر از دیتابیس
    const user = await getUserById(session.user.id);

    // ۴. هدایت بر اساس روش پرداخت

    // 🟢 حالت اول: پرداخت آنلاین (Online)
    // فرض: PAYMENT_METHOD.ONLINE برابر با مقدار ذخیره شده در دیتابیس است
    if (user.paymentMethod === PAYMENT_METHOD.ONLINE) {
      // این تابع باید لینک درگاه زیبال را تولید کند
      const paymentRes = await createPayment(orderId);

      if (!paymentRes.success || !paymentRes.url) {
        return {
          success: false,
          message: paymentRes.message || "خطا در دریافت لینک پرداخت",
          error: {
            type: "custom",
            message: paymentRes.message || "خطا در اتصال به بانک",
          },
        };
      }

      // هدایت کاربر به درگاه بانکی (زیبال)
      return {
        success: true,
        message: "در حال انتقال به درگاه پرداخت...",
        redirectTo: paymentRes.url,
      };
    }

    // 🟡 حالت دوم: کارت به کارت (Card / Offline)
    // فرض: PAYMENT_METHOD.CARD برابر با مقدار ذخیره شده در دیتابیس است
    if (user.paymentMethod === PAYMENT_METHOD.CARD) {
      // ✅ تغییر مهم: هدایت به صفحه نتیجه با پارامتر method=cardToCard
      // این باعث می‌شود صفحه نتیجه، متن آبی رنگ و شماره کارت را نمایش دهد
      return {
        success: true,
        message: "سفارش ثبت شد. جهت تکمیل پرداخت اقدام نمایید.",
        redirectTo: `/shop/order/result?orderId=${orderId}&method=${PAYMENT_METHOD.CARD}`,
      };
    }

    // 🔴 حالت نامعتبر
    return {
      success: false,
      message: "روش پرداخت انتخاب شده نامعتبر است.",
      error: {
        type: "custom",
        message: `روش پرداخت نامعتبر: ${user.paymentMethod}`,
      },
    };
  } catch (err) {
    console.error("Payment Handle Error:", err);
    return {
      success: false,
      message: formatError(err),
      error: { type: "custom", message: formatError(err) },
    };
  }
}

// =================================================================
// 2. GET ORDER BY ID (دریافت اطلاعات سفارش)
// =================================================================
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

// =================================================================
// 5. UPDATE ORDER TO PAID (تکمیل سفارش و کسر موجودی)
// =================================================================
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
}

// =================================================================
// 6. GET MY ORDERS (سفارش‌های کاربر)
// =================================================================
export async function getMyOrders({
  limit = 10,
  page = 1,
}: {
  limit?: number;
  page?: number;
}): Promise<{ data: Order[]; totalPages: number }> {
  // 👈 تایپ خروجی به صورت صریح تعریف شد
  const session = await auth();
  if (!session) throw new Error("عدم دسترسی");

  // دریافت دیتای خام از دیتابیس همراه با آیتم‌ها و مشخصات کاربر
  const rawData = await db.query.orders.findMany({
    where: eq(orders.userId, session.user.id),
    orderBy: [desc(orders.createdAt)],
    limit: limit,
    offset: (page - 1) * limit,
    with: {
      items: true,
      user: {
        columns: { name: true, email: true },
      },
    },
  });

  const [countResult] = await db
    .select({ count: count() })
    .from(orders)
    .where(eq(orders.userId, session.user.id));

  // 🌟 نرمال‌سازی دیتا: تبدیل دیتای خام دیتابیس به تایپ دقیق Order
  const normalizedData: Order[] = rawData.map((order: any) => ({
    ...order,
    userId: order.userId as string,
    paymentMethod: order.paymentMethod as string,
    isPaid: order.isPaid ?? false,
    isDelivered: order.isDelivered ?? false,
    shippingAddress: order.shippingAddress as Order["shippingAddress"],
    paymentResult: order.paymentResult as Order["paymentResult"],

    // تبدیل items دیتابیس به orderItems مورد انتظار شما
    orderItems: order.items || [],

    // اطمینان از فرمت کاربر
    user: order.user || { name: "کاربر", email: "" },
  }));

  return {
    data: normalizedData, // 👈 حالا دیتای تمیز و منطبق بر تایپ برمی‌گردد
    totalPages: Math.ceil(countResult.count / limit),
  };
}

// =================================================================
// 7. GET ALL ORDERS (برای ادمین)
// =================================================================
export async function getAllOrders({
  limit = 10,
  page = 1,
  query,
}: {
  limit?: number;
  page?: number;
  query?: string;
}) {
  // ساخت شرط جستجو در صورت وجود query
  // توجه: جستجو با ilike روی فیلدهای UUID مثل order.id در پستگرس مستقیماً کار نمی‌کند
  // معمولاً جستجو بر اساس نام کاربر یا شماره سفارش (اگر فیلد عددی جدا دارید) انجام می‌شود.
  // در اینجا یک شرط ساده قرار دادیم که اگر نیاز بود توسعه دهید.

  const data = await db.query.orders.findMany({
    orderBy: [desc(orders.createdAt)],
    limit: limit,
    offset: (page - 1) * limit,
    with: { user: { columns: { name: true } } },
  });

  const [countResult] = await db.select({ count: count() }).from(orders);

  return {
    data,
    totalPages: Math.ceil(countResult.count / limit),
  };
}

// =================================================================
// 8. GET ORDER SUMMARY (آمار داشبورد ادمین)
// =================================================================
export async function getOrderSummary() {
  // 1. تعداد سفارشات
  const ordersCount = await db.select({ count: count() }).from(orders);

  // 2. تعداد محصولات (تعداد کل واریانت‌ها یا تعداد رکوردهای محصولات)
  // اگر می‌خواهید تعداد "انواع محصول" را بدانید:
  const productsCount = await db.select({ count: count() }).from(products);

  // اگر می‌خواهید "موجودی کل انبار" (مجموع stock همه واریانت‌ها) را بدانید:
  // const totalStock = await db.select({ sum: sum(productVariants.stock) }).from(productVariants);

  // 3. تعداد کاربران
  const usersCount = await db.select({ count: count() }).from(users);

  // 4. مجموع فروش (از روی سفارشات پرداخت شده)
  const ordersPrice = await db
    .select({ sum: sum(orders.totalPrice) })
    .from(orders)
    .where(eq(orders.isPaid, true)); // فقط سفارشات پرداخت شده

  // 5. نمودار فروش ماهانه (نیاز به تبدیل تاریخ دارد)
  // نکته: تابع to_char برای پستگرس است.
  const salesData = await db
    .select({
      months: sql<string>`to_char(${orders.createdAt}, 'MM/YY')`,
      totalSales: sum(orders.totalPrice),
    })
    .from(orders)
    .where(eq(orders.isPaid, true)) // فقط پرداخت شده‌ها
    .groupBy(sql`to_char(${orders.createdAt}, 'MM/YY')`)
    .orderBy(sql`to_char(${orders.createdAt}, 'MM/YY')`);

  // 6. آخرین سفارشات
  const latestOrders = await db.query.orders.findMany({
    orderBy: [desc(orders.createdAt)],
    limit: 6,
    with: {
      user: { columns: { name: true } },
    },
  });

  return {
    ordersCount: ordersCount[0].count,
    productsCount: productsCount[0].count,
    usersCount: usersCount[0].count,
    ordersPrice: ordersPrice[0].sum ?? 0, // هندل کردن مقدار null
    salesData,
    latestOrders,
  };
}

// =================================================================
// 9. DELETE ORDER (حذف سفارش)
// =================================================================
export async function deleteOrder(id: string) {
  try {
    await db.delete(orders).where(eq(orders.id, id));
    revalidatePath("/admin/orders");
    return { success: true, message: "سفارش حذف شد" };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// =================================================================
// 10. DELIVER ORDER (تحویل سفارش)
// =================================================================
export async function deliverOrder(orderId: string) {
  try {
    const order = await db.query.orders.findFirst({
      where: eq(orders.id, orderId),
    });
    if (!order) throw new Error("سفارش یافت نشد");

    await db
      .update(orders)
      .set({ isDelivered: true, deliveredAt: new Date() })
      .where(eq(orders.id, orderId));

    revalidatePath(`/order/${orderId}`);
    return { success: true, message: "وضعیت سفارش به تحویل شده تغییر یافت" };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// =================================================================
// 11. UPDATE COD TO PAID (پرداخت در محل)
// =================================================================
export async function updateOrderToPaidCOD(orderId: string) {
  try {
    await updateOrderToPaid({ orderId });
    revalidatePath(`/order/${orderId}`);
    return { success: true, message: "سفارش پرداخت در محل تایید شد" };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}
