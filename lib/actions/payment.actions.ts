"use server";

import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq } from "drizzle-orm";
import { PAYMENT_CALLBACK_URL, ZIBAL_MERCHANT } from "../constants";
import { formatError } from "../utils/formatError";
import { revalidatePath } from "next/cache";
import { updateOrderToPaid } from "./order.actions";

export async function createPayment(orderId: string) {
  try {
    const order = await db.query.orders.findFirst({
      where: eq(orders.id, orderId),
    });

    if (!order) {
      throw new Error("سفارش یافت نشد");
    }

    // convert price to rial
    const amountInRial = Number(order.totalPrice) * 10;
    const callbackUrl = `${PAYMENT_CALLBACK_URL}/verify-payment?orderId=${orderId}`;

    // POST REQUEST TO API
    const response = await fetch("https://gateway.zibal.ir/v1/request", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        merchant: ZIBAL_MERCHANT,
        amount: amountInRial,
        callbackUrl: callbackUrl,
        description: `پرداخت سفارش شماره ${orderId}`,
        orderId: orderId,
      }),
    });

    const data = await response.json();

    if (data.result === 100) {
      // کد 100 یعنی توکن پرداخت با موفقیت ایجاد شد
      await db
        .update(orders)
        .set({
          paymentResult: { trackId: data.trackId, status: "pending" },
        })
        .where(eq(orders.id, orderId));

      return {
        success: true,
        // این لینکی است که کاربر باید به آن هدایت (Redirect) شود
        url: `https://gateway.zibal.ir/start/${data.trackId}`,
      };
    } else {
      throw new Error(`خطا در درگاه زیبال: کد ${data.result}`);
    }
  } catch (err) {
    return { success: false, message: formatError(err) };
  }
}

// =================================================================
// 2. VERIFY ZIBAL PAYMENT (تایید پرداخت با fetch پس از بازگشت کاربر)
// =================================================================
export async function verifyPayment(trackId: string, orderId: string) {
  try {
    // ارسال درخواست تایید به API زیبال
    const response = await fetch("https://gateway.zibal.ir/v1/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        merchant: ZIBAL_MERCHANT,
        trackId: trackId,
      }),
    });

    const data = await response.json();
    // کد 100: پرداخت الان موفق بود
    // کد 201: پرداخت قبلاً تایید شده است (جلوگیری از دوبار تایید شدن)

    if (data.result === 100 || data.result === 201) {
      // فراخوانی اکشن آپدیت وضعیت سفارش به "پرداخت شده"
      await updateOrderToPaid({
        orderId,
        paymentResult: {
          trackId: trackId,
          refNumber: data.refNumber,
          paidAt: new Date().toISOString(),
          status: "success",
          // ✅ کلید اصلاح شد: cardNumber به جای cardPan
          cardNumber: data.cardNumber,
          // (اختیاری) ذخیره اطلاعات بیشتر جهت کامل‌تر شدن رسید
          amount: data.amount,
          orderId: orderId,
        },
      });

      revalidatePath(`/my-account/orders/${orderId}`);

      return { success: true, message: "پرداخت با موفقیت انجام و تایید شد." };
    } else {
      // پرداخت ناموفق بود
      return {
        success: false,
        message: `پرداخت ناموفق بود. کد خطا: ${data.result}`,
      };
    }
  } catch (err) {
    return { success: false, message: formatError(err) };
  }
}
