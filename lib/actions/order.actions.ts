"use server";

import {
  ActionResult,
  CartItem,
  Order,
  OrderList,
  OrdersPaginatedData,
} from "@/types";
import { getCurrentSession, requireAdmin } from "../auth/authGuard";
import { getMyCart } from "./cart.actions";
import { getUserById } from "./user.actions";
import { updateOrderToPaid } from "../services/order.service";
import { validateCouponForUser } from "../services/coupon.service";
import {
  insertOrderSchema,
  shippingAddressSchema,
} from "../validations/orderValidations";
import { db } from "@/db";
import {
  carts,
  coupons,
  couponUsages,
  orderItems,
  orders,
  products,
  users,
} from "@/db/schema";
import { count, desc, eq, sql, sum, ilike, and } from "drizzle-orm";
import { formatError } from "../utils/formatError";
import { revalidatePath } from "next/cache";
import { createPayment } from "./payment.actions";
import { PAYMENT_METHOD } from "../constants";
import { generateRandomNumber } from "../utils/generateRandomNumber";
import {
  sendOrderSuccessSmsToAdmin,
  sendOrderSuccessSmsToClient,
} from "./sms.actions";

// =================================================================
// 1. CREATE ORDER (ایجاد سفارش اولیه)
// =================================================================

export async function createOrder(): Promise<ActionResult<string>> {
  try {
    const session = await getCurrentSession();
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

    const user = await getUserById();
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

    // generate refNumber
    const refNumber = generateRandomNumber("Anima");

    // 🔒 اگر روی سبد کد تخفیف اعمال شده، همینجا دوباره از صفر اعتبارسنجی‌اش
    // می‌کنیم — چیزی می‌تواند بین لحظه‌ی اعمال کوپن روی سبد و لحظه‌ی ثبت
    // نهایی سفارش تغییر کرده باشد (مثلاً ظرفیت کد تمام شده باشد)
    let appliedCoupon: typeof coupons.$inferSelect | null = null;
    if (cart.couponCode) {
      const couponCheck = await validateCouponForUser(
        cart.couponCode,
        userId,
        cart.itemsPrice,
      );
      if (!couponCheck.valid) {
        return {
          success: false,
          message: couponCheck.message,
          error: { type: "custom", message: couponCheck.message },
          redirectTo: "/shop/cart",
        };
      }
      appliedCoupon = couponCheck.coupon;
    }

    const orderData = insertOrderSchema.parse({
      userId: userId, // اصلاح شد
      refNumber,
      shippingAddress: user.address,
      paymentMethod: user.paymentMethod || PAYMENT_METHOD.ONLINE,
      itemsPrice: cart.itemsPrice,
      taxPrice: cart.taxPrice,
      totalPrice: cart.totalPrice,
      couponCode: appliedCoupon?.code ?? null,
      discountAmount: cart.discountAmount ?? 0,
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

      // 2.5 ثبت استفاده از کد تخفیف (اگر بوده) — برای اعمال محدودیت
      // "هر کاربر حداکثر N بار" در دفعات بعدی + افزایش شمارنده‌ی کلی
      if (appliedCoupon) {
        await tx.insert(couponUsages).values({
          couponId: appliedCoupon.id,
          userId,
          orderId: newOrder.id,
        });

        await tx
          .update(coupons)
          .set({ usedCount: appliedCoupon.usedCount + 1 })
          .where(eq(coupons.id, appliedCoupon.id));
      }

      // 3. خالی کردن سبد خرید
      await tx
        .update(carts)
        .set({
          items: [],
          totalPrice: 0, // به صورت استرینگ ذخیره شود بهتر است (بستگی به نوع فیلد decimal در دیتابیس دارد)
          itemsPrice: 0,
          taxPrice: 0,
          discountAmount: 0,
          couponCode: null,
          couponType: null,
          couponValue: null,
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
    const session = await getCurrentSession();
    if (!session?.user?.id) {
      return {
        success: false,
        message: "کاربر یافت نشد. لطفا مجدد وارد شوید.",
        error: { type: "custom", message: "کاربر یافت نشد." },
      };
    }

    // گرفتن تازه‌ترین وضعیت کاربر از دیتابیس
    const user = await getUserById();

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
      // ارسال پیامک به کاربر و ادمین برای ثبت سفارش
      sendOrderSuccessSmsToClient(orderId);
      sendOrderSuccessSmsToAdmin(orderId);
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
// این تابع هم به lib/services/order.service.ts منتقل شد — هیچ‌کدام از
// مصرف‌کننده‌های واقعی‌اش (صفحات Server Component و پیامک‌های سیستمی)
// نیازی نداشتند که این یک Server Action مستقل و مستقیماً قابل‌فراخوانی
// از کلاینت باشد؛ در حالی که چون بود، هرکسی می‌توانست با هر orderId
// دلخواه، جزئیات کامل سفارش (آدرس، اقلام، نام/ایمیل خریدار) هر کاربری
// را بگیرد.

// =================================================================
// 5. UPDATE ORDER TO PAID (تکمیل سفارش و کسر موجودی)
// =================================================================
// این تابع به lib/services/order.service.ts منتقل شد تا دیگر یک Server
// Action مستقل و مستقیماً قابل‌فراخوانی از کلاینت نباشد — پایین‌تر با
// import مصرف می‌شود.

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
  const session = await getCurrentSession();
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
}): Promise<ActionResult<OrdersPaginatedData>> {
  try {
    // 🔒 این عملیات فقط برای ادمین مجاز است
    await requireAdmin();

    const searchCondition = query
      ? ilike(orders.refNumber, `%${query}%`)
      : undefined;

    // دریافت داده خام از دیتابیس
    const rawData = await db.query.orders.findMany({
      where: searchCondition,
      orderBy: [desc(orders.createdAt)],
      limit: limit,
      offset: (page - 1) * limit,
      with: { user: { columns: { name: true } } },
    });

    // محاسبه تعداد کل نتایج برای Pagination
    const [countResult] = await db
      .select({ count: count() })
      .from(orders)
      .where(searchCondition);

    const ordersList: OrderList[] = rawData.map((item) => {
      return {
        // کپی کردن فیلدهای مشترک (id, createdAt, totalPrice, ...)
        ...item,

        // رفع خطای shippingAddress (تبدیل unknown به تایپ مورد نظر)
        shippingAddress: item.shippingAddress as Order["shippingAddress"],

        // رفع خطای احتمالی null بودن user (اگر کاربر حذف شده باشد)
        user: item.user ? { name: item.user.name } : { name: "کاربر حذف شده" },

        // اطمینان از اینکه فیلدهای حذف شده (Omit) مقداردهی نمی‌شوند یا اگر می‌شوند تایپ‌اسکریپت نادیده بگیرد
      } as OrderList;
    });

    // بازگرداندن پاسخ موفق بر اساس ActionResult
    return {
      success: true,
      data: {
        ordersList: ordersList,
        totalPages: Math.ceil(countResult.count / limit),
      },
    };
  } catch (error) {
    console.error("Fetch Orders Error:", error);
    // بازگرداندن پاسخ خطا بر اساس ActionResult
    return {
      success: false,
      error: {
        type: "custom",
        message: "خطا در برقراری ارتباط با دیتابیس و دریافت سفارشات",
      },
    };
  }
}

// =================================================================
// 8. GET ORDER SUMMARY (آمار داشبورد ادمین)
// =================================================================
export async function getOrderSummary() {
  // 🔒 این عملیات فقط برای ادمین مجاز است
  await requireAdmin();

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
    // 🔒 این عملیات فقط برای ادمین مجاز است
    await requireAdmin();

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
    // 🔒 این عملیات فقط برای ادمین مجاز است
    await requireAdmin();

    const order = await db.query.orders.findFirst({
      where: eq(orders.id, orderId),
    });
    if (!order) throw new Error("سفارش یافت نشد");

    await db
      .update(orders)
      .set({ isDelivered: true, deliveredAt: new Date() })
      .where(eq(orders.id, orderId));

    revalidatePath(`/my-account/orders/order/${orderId}`);
    revalidatePath(`/admin/orders/order/${orderId}`);
    revalidatePath("/admin/orders");
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
    // 🔒 فقط ادمین می‌تواند دریافت وجه نقدی/درب منزل را تایید کند
    await requireAdmin();

    await updateOrderToPaid({ orderId });
    revalidatePath(`/my-account/orders/order/${orderId}`);
    revalidatePath(`/admin/orders/order/${orderId}`);
    revalidatePath("/admin/orders");
    return { success: true, message: "سفارش پرداخت در محل تایید شد" };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}
