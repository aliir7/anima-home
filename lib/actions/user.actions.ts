"use server";

import {
  ActionResult,
  ContactFormValues,
  PaymentMethod,
  PaymentMethodFormValues,
  ShippingAddress,
  UsersPaginatedData,
} from "@/types";
import { contactFormSchema } from "../validations/usersValidations";
import { sendGmailAction, sendMailAction } from "./mail.actions";
import { db } from "@/db";
import { count, desc, eq, ilike, or } from "drizzle-orm";
import { users } from "@/db/schema";
import { getCurrentSession, requireAdmin } from "../auth/authGuard";
import {
  paymentMethodSchema,
  shippingAddressSchema,
} from "../validations/orderValidations";
import { formatError } from "../utils/formatError";
import { checkRateLimit, rateLimitMessage } from "../rate-limit";
import { revalidatePath } from "next/cache";

export async function submitContactForm(
  data: ContactFormValues,
): Promise<ActionResult<string>> {
  const rateLimit = await checkRateLimit("contact-form", {
    windowMs: 60 * 60 * 1000,
    max: 5,
  });
  if (!rateLimit.allowed) {
    return {
      success: false,
      error: {
        type: "custom",
        message: rateLimitMessage(rateLimit.retryAfterSeconds),
      },
    };
  }

  try {
    const validated = contactFormSchema.safeParse(data);

    if (!validated.success) {
      return {
        success: false,
        error: {
          type: "zod",
          issues: validated.error.issues,
        },
      };
    }

    const { name, email, message, subject } = validated.data;
    const finalSubject = subject || "پیام جدید از فرم تماس";

    // 3. ساخت HTML (همان قالب تمیز و مدرن)
    const htmlContent = `
    <div style="background-color: #f3f4f6; padding: 40px 0; direction: rtl; font-family: Tahoma, Arial, sans-serif; line-height: 1.6;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
        
        <div style="text-align: center; margin-bottom: 30px;">
          <h2 style="color: #1f2937; margin: 0; font-size: 24px;">📩 پیام جدید از فرم تماس</h2>
        </div>

        <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin-bottom: 25px; border: 1px solid #e5e7eb;">
          <p style="margin: 10px 0; color: #374151;"><strong>👤 نام فرستنده:</strong> ${name}</p>
          <p style="margin: 10px 0; color: #374151;"><strong>📧 ایمیل فرستنده:</strong> ${email}</p>
          <p style="margin: 10px 0; color: #374151;"><strong>🔖 موضوع:</strong> ${finalSubject}</p>
        </div>

        <div style="margin-bottom: 30px;">
          <h3 style="color: #374151; font-size: 18px; border-bottom: 2px solid #4a5a45; display: inline-block; padding-bottom: 5px;">متن پیام:</h3>
          <div style="background-color: #fff; border-right: 4px solid #4a5a45; padding: 15px; color: #4b5563; white-space: pre-line;">
            ${message}
          </div>
        </div>

        <div style="text-align: center;">
          <a href="mailto:${email}?subject=پاسخ: ${finalSubject}" 
             style="display: inline-block; padding: 12px 30px; background-color: #4a5a45; color: white; text-decoration: none; border-radius: 8px;">
             پاسخ به کاربر
          </a>
        </div>

      </div>
    </div>
  `;

    // 4. ارسال ایمیل به مدیر سایت (شما)
    const receiverEmail = process.env.MAIL_ADMIN || "info@anima-home.ir";

    return await sendGmailAction({
      email: receiverEmail,
      replyTo: email,
      senderName: name,
      subject: `فرم تماس: ${name} - ${finalSubject}`,
      html: htmlContent,
      text: `پیام از ${name} (${email}):\n\n${message}`,
    });
  } catch (error) {
    return {
      success: false,
      error: { type: "custom", message: `خطا در ارسال ایمیل ${error}` },
    };
  }
}

export async function getUserById() {
  const session = await getCurrentSession();
  if (!session?.user?.id) {
    throw new Error("لطفا ابتدا وارد حساب کاربری شوید");
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
  });

  if (!user) {
    throw new Error("کاربر یافت نشد");
  }

  return { ...user };
}

// =================================================================
//  UPDATE USER ADDRESS
// =================================================================

export async function updateUserAddress(
  data: ShippingAddress,
): Promise<ActionResult<string>> {
  try {
    const session = await getCurrentSession();
    const userId = session?.user?.id;

    // find user by id
    const currentUser = await db.query.users.findFirst({
      where: eq(users.id, userId!),
    });

    if (!currentUser) {
      throw new Error("کاربر یافت نشد");
    }

    // address validation
    const validation = shippingAddressSchema.safeParse(data);

    if (!validation.success) {
      return {
        success: false,
        message: formatError(validation.error.issues),
        error: {
          type: "zod",
          issues: validation.error.issues,
        },
      };
    }
    const address = validation.data;

    // update address
    await db
      .update(users)
      .set({
        address,
      })
      .where(eq(users.id, currentUser.id));

    return {
      success: true,
      message: `آدرس شما با موفقیت ثبت شد`,
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
//  UPDATE USER PAYMENT METHOD
// =================================================================

export async function updateUserPaymentMethod(
  data: PaymentMethodFormValues,
): Promise<ActionResult<string>> {
  try {
    const session = await getCurrentSession();
    const userId = session?.user?.id;

    // find user by id
    const currentUser = await db.query.users.findFirst({
      where: eq(users.id, userId!),
    });

    if (!currentUser) {
      throw new Error("کاربر یافت نشد");
    }

    // validation
    const validation = paymentMethodSchema.safeParse(data);

    if (!validation.success) {
      return {
        success: false,
        message: formatError(validation.error.issues),
        error: {
          type: "zod",
          issues: validation.error.issues,
        },
      };
    }
    const paymentMethod = validation.data;

    // update payment method
    await db
      .update(users)
      .set({
        paymentMethod: paymentMethod.type,
      })
      .where(eq(users.id, currentUser.id));

    return {
      success: true,
      message: `آدرس شما با موفقیت ثبت شد`,
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
//  ADMIN: GET ALL USERS (لیست کاربران برای پنل ادمین)
// =================================================================

export async function getAllUsers({
  limit = 10,
  page = 1,
  query,
}: {
  limit?: number;
  page?: number;
  query?: string;
}): Promise<ActionResult<UsersPaginatedData>> {
  try {
    // 🔒 این عملیات فقط برای ادمین مجاز است
    await requireAdmin();

    const searchCondition = query
      ? or(
          ilike(users.name, `%${query}%`),
          ilike(users.email, `%${query}%`),
          ilike(users.phoneNumber, `%${query}%`),
        )
      : undefined;

    const rawUsers = await db.query.users.findMany({
      where: searchCondition,
      orderBy: [desc(users.createdAt)],
      limit,
      offset: (page - 1) * limit,
      columns: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        role: true,
        emailVerified: true,
        createdAt: true,
      },
    });

    const [countResult] = await db
      .select({ count: count() })
      .from(users)
      .where(searchCondition);

    return {
      success: true,
      data: {
        usersList: rawUsers,
        totalPages: Math.ceil(countResult.count / limit),
      },
    };
  } catch (error) {
    console.error("Fetch Users Error:", error);
    return {
      success: false,
      error: {
        type: "custom",
        message: "خطا در برقراری ارتباط با دیتابیس و دریافت کاربران",
      },
    };
  }
}

// =================================================================
//  ADMIN: UPDATE USER ROLE (تغییر نقش کاربر توسط ادمین)
// =================================================================

export async function updateUserRole(
  userId: string,
  newRole: "user" | "admin",
): Promise<ActionResult<string>> {
  try {
    // 🔒 این عملیات فقط برای ادمین مجاز است
    const session = await requireAdmin();

    if (newRole !== "user" && newRole !== "admin") {
      return {
        success: false,
        error: { type: "custom", message: "نقش نامعتبر است" },
      };
    }

    // 🔒 جلوگیری از تغییر نقش خودِ ادمین — تا یک ادمین به‌طور تصادفی
    // خودش را از دسترسی مدیریت محروم نکند (مخصوصاً اگر تنها ادمین سیستم باشد)
    if (session.user.id === userId) {
      return {
        success: false,
        error: {
          type: "custom",
          message: "نمی‌توانید نقش خودتان را تغییر دهید",
        },
      };
    }

    const targetUser = await db.query.users.findFirst({
      where: eq(users.id, userId),
      columns: { id: true },
    });

    if (!targetUser) {
      return {
        success: false,
        error: { type: "custom", message: "کاربر یافت نشد" },
      };
    }

    await db.update(users).set({ role: newRole }).where(eq(users.id, userId));

    revalidatePath("/admin/users");

    return {
      success: true,
      data:
        newRole === "admin"
          ? "کاربر به ادمین ارتقا یافت"
          : "دسترسی ادمین از کاربر گرفته شد",
    };
  } catch (err) {
    return {
      success: false,
      error: { type: "custom", message: formatError(err) },
    };
  }
}
