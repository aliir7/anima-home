"use server";

import { isAPIError } from "better-auth/api";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { db } from "@/db";
import { users } from "@/db/schema";
import { ActionResult } from "@/types";
import { auth } from "../auth";
import { getCurrentSession } from "../auth/authGuard";
import { checkRateLimit, rateLimitMessage } from "../rate-limit";
import {
  deleteStorageFiles,
  extractStorageKey,
} from "../services/storage.service";
import { mobileSchema, otpSchema } from "../validations/smsValidations";
import { changeEmailSchema } from "../validations/usersValidations";
import { getAuthErrorCode } from "../utils/authError";

// ------------------------------------------------------------------
// نکته‌ی مهم امنیتی: چک احراز هویت در لایوت my-account فقط جلوی نمایش
// صفحه را می‌گیرد، نه فراخوانی مستقیم این Server Actionها. به همین دلیل
// هر اکشن این فایل مستقل و از نو نشست کاربر را چک می‌کند.
// ------------------------------------------------------------------
async function getLoggedInSession() {
  const session = await getCurrentSession();
  if (!session?.user?.id) return null;
  return session;
}

const NOT_LOGGED_IN_ERROR: ActionResult<never> = {
  success: false,
  error: { type: "custom", message: "لطفاً ابتدا وارد حساب کاربری شوید" },
};

// ================================================================
// تغییر ایمیل
// ================================================================
export async function changeEmailAction(
  newEmail: string,
): Promise<ActionResult<string>> {
  try {
    const session = await getLoggedInSession();
    if (!session) return NOT_LOGGED_IN_ERROR;

    const validated = changeEmailSchema.safeParse({ newEmail });
    if (!validated.success) {
      return {
        success: false,
        error: { type: "zod", issues: validated.error.issues },
      };
    }

    if (validated.data.newEmail === session.user.email) {
      return {
        success: false,
        error: { type: "custom", message: "این آدرس همان ایمیل فعلی شماست" },
      };
    }

    const rateLimit = await checkRateLimit(
      "change-email",
      { windowMs: 15 * 60 * 1000, max: 5 },
      session.user.id,
    );
    if (!rateLimit.allowed) {
      return {
        success: false,
        error: {
          type: "custom",
          message: rateLimitMessage(rateLimit.retryAfterSeconds),
        },
      };
    }

    await auth.api.changeEmail({
      body: {
        newEmail: validated.data.newEmail,
        callbackURL: "/my-account/email",
      },
      headers: await headers(),
    });

    return {
      success: true,
      data: "ایمیلی برای تایید این تغییر به ایمیل فعلی شما ارسال شد. پس از تایید، یک ایمیل تایید دیگر هم برای آدرس جدید ارسال می‌شود.",
    };
  } catch (error) {
    console.error("changeEmailAction error:", error);

    if (isAPIError(error)) {
      return {
        success: false,
        error: {
          type: "custom",
          message:
            "این ایمیل قبلاً برای حساب دیگری ثبت شده یا تغییر آن ممکن نیست.",
        },
      };
    }

    return {
      success: false,
      error: { type: "custom", message: "تغییر ایمیل انجام نشد." },
    };
  }
}

// ================================================================
// ارسال دوباره‌ی ایمیل تایید (برای ایمیل فعلیِ تایید‌نشده)
// ================================================================
export async function resendEmailVerificationAction(): Promise<
  ActionResult<string>
> {
  try {
    const session = await getLoggedInSession();
    if (!session) return NOT_LOGGED_IN_ERROR;

    if (!session.user.email) {
      return {
        success: false,
        error: { type: "custom", message: "ایمیلی برای این حساب ثبت نشده است" },
      };
    }

    if (session.user.emailVerified) {
      return { success: true, data: "ایمیل شما هم‌اکنون تایید شده است." };
    }

    const rateLimit = await checkRateLimit(
      "resend-verify-email",
      { windowMs: 10 * 60 * 1000, max: 3 },
      session.user.id,
    );
    if (!rateLimit.allowed) {
      return {
        success: false,
        error: {
          type: "custom",
          message: rateLimitMessage(rateLimit.retryAfterSeconds),
        },
      };
    }

    await auth.api.sendVerificationEmail({
      body: {
        email: session.user.email,
        callbackURL: "/my-account/email",
      },
      headers: await headers(),
    });

    return { success: true, data: "ایمیل تایید دوباره ارسال شد." };
  } catch (error) {
    console.error("resendEmailVerificationAction error:", error);
    return {
      success: false,
      error: { type: "custom", message: "ارسال ایمیل تایید انجام نشد." },
    };
  }
}

// ================================================================
// تغییر شماره موبایل — مرحله ۱: ارسال کد به شماره‌ی جدید
// ================================================================
export async function sendChangePhoneOtpAction(
  newPhone: string,
): Promise<ActionResult<string>> {
  try {
    const session = await getLoggedInSession();
    if (!session) return NOT_LOGGED_IN_ERROR;

    const parsed = mobileSchema.safeParse({ mobile: newPhone });
    if (!parsed.success) {
      return {
        success: false,
        error: { type: "zod", issues: parsed.error.issues },
      };
    }
    const { mobile: phoneNumber } = parsed.data;

    if (phoneNumber === session.user.phoneNumber) {
      return {
        success: false,
        error: { type: "custom", message: "این شماره همان شماره فعلی شماست" },
      };
    }

    const rateLimit = await checkRateLimit(
      "change-phone-otp",
      { windowMs: 10 * 60 * 1000, max: 3 },
      session.user.id,
    );
    if (!rateLimit.allowed) {
      return {
        success: false,
        error: {
          type: "custom",
          message: rateLimitMessage(rateLimit.retryAfterSeconds),
        },
      };
    }

    await auth.api.sendPhoneNumberOTP({
      body: { phoneNumber },
    });

    return { success: true, data: "کد تایید برای شماره جدید ارسال شد." };
  } catch (error) {
    console.error("sendChangePhoneOtpAction error:", error);
    return {
      success: false,
      error: { type: "custom", message: "ارسال کد تایید انجام نشد." },
    };
  }
}

// ================================================================
// تغییر شماره موبایل — مرحله ۲: تایید کد و اعمال تغییر
// ================================================================

// پیام فارسی مناسب برای هر کد خطای شناخته‌شده‌ی پلاگین phoneNumber
const PHONE_VERIFY_ERROR_MESSAGES: Record<string, string> = {
  PHONE_NUMBER_EXIST: "این شماره موبایل قبلاً برای حساب دیگری ثبت شده است.",
  INVALID_OTP: "کد وارد شده اشتباه است.",
  OTP_EXPIRED: "کد تایید منقضی شده است؛ دوباره درخواست کد دهید.",
  OTP_NOT_FOUND: "کد تایید یافت نشد؛ دوباره درخواست کد دهید.",
  TOO_MANY_ATTEMPTS:
    "تعداد تلاش‌های مجاز به پایان رسید؛ دوباره درخواست کد دهید.",
};

export async function verifyChangePhoneOtpAction(data: {
  newPhone: string;
  code: string;
}): Promise<ActionResult<string>> {
  try {
    const session = await getLoggedInSession();
    if (!session) return NOT_LOGGED_IN_ERROR;

    const parsed = otpSchema.safeParse({
      mobile: data.newPhone,
      code: data.code,
    });
    if (!parsed.success) {
      return {
        success: false,
        error: { type: "zod", issues: parsed.error.issues },
      };
    }
    const { mobile: phoneNumber, code } = parsed.data;

    const rateLimit = await checkRateLimit(
      "verify-change-phone-otp",
      { windowMs: 5 * 60 * 1000, max: 5 },
      session.user.id,
    );
    if (!rateLimit.allowed) {
      return {
        success: false,
        error: {
          type: "custom",
          message: rateLimitMessage(rateLimit.retryAfterSeconds),
        },
      };
    }

    await auth.api.verifyPhoneNumber({
      body: {
        phoneNumber,
        code,
        updatePhoneNumber: true,
      },
      headers: await headers(),
    });

    revalidatePath("/my-account/phone");
    revalidatePath("/my-account");

    return { success: true, data: "شماره موبایل شما با موفقیت تغییر و تایید شد." };
  } catch (error) {
    console.error("verifyChangePhoneOtpAction error:", error);

    if (isAPIError(error)) {
      const code = getAuthErrorCode(error);
      const message =
        (code && PHONE_VERIFY_ERROR_MESSAGES[code]) ||
        "کد وارد شده اشتباه یا منقضی شده است.";

      return {
        success: false,
        error: { type: "custom", message },
      };
    }
    return {
      success: false,
      error: { type: "custom", message: "تایید شماره موبایل انجام نشد." },
    };
  }
}

// فقط یک الگوی ساده و امن: پوشه‌ی avatars/ + یک نام فایل تک‌بخشی (بدون /
// یا .. که بشود از آن برای path traversal استفاده کرد) — دقیقاً همون
// فرمتی که خودِ app/api/storage/upload/route.ts موقع آپلود می‌سازد
// (`avatars/${uuid()}${extension}`).
const AVATAR_KEY_PATTERN = /^avatars\/[\w.-]+$/;

// مقدار ذخیره‌شده‌ی قبلیِ عکس پروفایل ممکن است به یکی از دو فرمت باشد:
// ۱) کلید نسبی جدید (avatars/xxx.jpg) — از این تغییر به بعد
// ۲) URL کامل قدیمی (https://.../avatars/xxx.jpg) — کاربرهایی که قبل از
//    این تغییر عکس آپلود کرده بودند
// این تابع هر دو حالت را به یک کلید قابل‌حذف تبدیل می‌کند.
function resolveAvatarKey(storedImage: string): string | null {
  if (storedImage.startsWith("http://") || storedImage.startsWith("https://")) {
    return extractStorageKey(storedImage);
  }
  return AVATAR_KEY_PATTERN.test(storedImage) ? storedImage : null;
}

// ================================================================
// عکس پروفایل — به‌روزرسانی
// ================================================================
export async function updateAvatarAction(
  newImageKey: string,
): Promise<ActionResult<string>> {
  try {
    const session = await getLoggedInSession();
    if (!session) return NOT_LOGGED_IN_ERROR;

    // 🔒 فقط کلیدهایی با همین فرمت (که خودِ مسیر آپلود می‌سازد) پذیرفته
    // می‌شوند — نه یک URL کامل و نه هیچ مسیر دلخواه دیگر. از این به بعد
    // فقط همین مسیر نسبی (avatars/xxx.jpg) در دیتابیس ذخیره می‌شود؛ آدرس
    // کامل نمایش، هر جا لازم بود، با getStorageUrl() ساخته می‌شود.
    if (!AVATAR_KEY_PATTERN.test(newImageKey)) {
      return {
        success: false,
        error: { type: "custom", message: "آدرس تصویر معتبر نیست" },
      };
    }

    const currentUser = await db.query.users.findFirst({
      where: eq(users.id, session.user.id),
      columns: { image: true },
    });

    await db
      .update(users)
      .set({ image: newImageKey })
      .where(eq(users.id, session.user.id));

    // پاک‌کردن عکس قبلی از فضای ابری — کلیدِ حذف همیشه از روی مقدارِ
    // قبلیِ خودِ دیتابیس استخراج می‌شود، نه از ورودی کاربر؛ به این ترتیب
    // کاربر امکان حذف هیچ فایل دلخواه دیگری را ندارد.
    const oldKey = currentUser?.image
      ? resolveAvatarKey(currentUser.image)
      : null;
    if (oldKey && oldKey.startsWith("avatars/")) {
      deleteStorageFiles([oldKey]).catch((error) =>
        console.error("Failed to delete old avatar:", error),
      );
    }

    revalidatePath("/my-account");
    revalidatePath("/my-account/avatar");

    return { success: true, data: "عکس پروفایل با موفقیت به‌روزرسانی شد." };
  } catch (error) {
    console.error("updateAvatarAction error:", error);
    return {
      success: false,
      error: { type: "custom", message: "به‌روزرسانی عکس پروفایل انجام نشد." },
    };
  }
}

// ================================================================
// عکس پروفایل — حذف
// ================================================================
export async function removeAvatarAction(): Promise<ActionResult<string>> {
  try {
    const session = await getLoggedInSession();
    if (!session) return NOT_LOGGED_IN_ERROR;

    const currentUser = await db.query.users.findFirst({
      where: eq(users.id, session.user.id),
      columns: { image: true },
    });

    if (!currentUser?.image) {
      return { success: true, data: "عکس پروفایلی برای حذف وجود ندارد." };
    }

    await db
      .update(users)
      .set({ image: null })
      .where(eq(users.id, session.user.id));

    const oldKey = resolveAvatarKey(currentUser.image);
    if (oldKey && oldKey.startsWith("avatars/")) {
      deleteStorageFiles([oldKey]).catch((error) =>
        console.error("Failed to delete avatar:", error),
      );
    }

    revalidatePath("/my-account");
    revalidatePath("/my-account/avatar");

    return { success: true, data: "عکس پروفایل حذف شد." };
  } catch (error) {
    console.error("removeAvatarAction error:", error);
    return {
      success: false,
      error: { type: "custom", message: "حذف عکس پروفایل انجام نشد." },
    };
  }
}
