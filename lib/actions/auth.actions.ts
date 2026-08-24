"use server";

import { headers } from "next/headers";
import { isAPIError } from "better-auth/api";

import { auth } from "../auth";
import {
  signinSchema,
  signupFormSchema,
  forgotPasswordSchema,
  changePasswordSchema,
} from "../validations/usersValidations";
import type { ActionResult, SigninValues, SignupFormValues } from "@/types";

// ------------------------------------------------------------------
// 1. ثبت‌نام با ایمیل و پسورد
// ------------------------------------------------------------------
export async function signupAction(
  formData: SignupFormValues,
): Promise<ActionResult<{ email: string }>> {
  const validated = signupFormSchema.safeParse(formData);

  if (!validated.success) {
    return {
      success: false,
      error: {
        type: "zod",
        issues: validated.error.issues,
      },
    };
  }

  const { name, email, password } = validated.data;

  try {
    // Better Auth خودش کاربر را می‌سازد، پسورد را هش می‌کند
    // و ایمیل تایید را از طریق sendVerificationEmail hook ارسال می‌کند
    await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
      },
      headers: await headers(),
    });

    return {
      success: true,
      data: { email },
    };
  } catch (error) {
    console.error("signupAction error:", error);

    if (isAPIError(error)) {
      const code = (error as any)?.body?.code ?? (error as any)?.code;

      if (code === "USER_ALREADY_EXISTS") {
        return {
          success: false,
          error: {
            type: "custom",
            message: "کاربری با این ایمیل از قبل وجود دارد.",
          },
        };
      }

      return {
        success: false,
        error: {
          type: "custom",
          message: "ثبت‌نام انجام نشد. لطفاً دوباره تلاش کنید.",
        },
      };
    }

    return {
      success: false,
      error: {
        type: "custom",
        message: "خطای ناشناخته‌ای در ثبت‌نام رخ داد.",
      },
    };
  }
}

// ------------------------------------------------------------------
// 2. ورود با ایمیل و پسورد
// ------------------------------------------------------------------
export async function signinWithCredentials(
  formData: SigninValues,
): Promise<ActionResult<string>> {
  const validated = signinSchema.safeParse(formData);

  if (!validated.success) {
    console.error("❌ Zod Validation Failed:", validated.error.issues);
    return {
      success: false,
      error: { type: "zod", issues: validated.error.issues },
    };
  }

  const { email, password } = validated.data;

  if (!email || !password) {
    return {
      success: false,
      error: { type: "custom", message: "ایمیل و رمز عبور الزامی هستند" },
    };
  }

  try {
    const result = await auth.api.signInEmail({
      body: { email, password },
      headers: await headers(),
    });

    console.log("✅ Login successful for:", email);

    return {
      success: true,
      data: "با موفقیت وارد شدید",
    };
  } catch (error: any) {
    // 🔥 لاگ کامل برای دیباگ
    console.error("❌ signinWithCredentials error:", {
      message: error?.message,
      code: error?.code,
      body: error?.body,
      status: error?.status,
      fullError: JSON.stringify(error, null, 2),
    });

    if (isAPIError(error)) {
      const errorCode = error.body?.code || error.code;

      // مدیریت همه کدهای خطای احتمالی Better Auth
      switch (errorCode) {
        case "EMAIL_NOT_VERIFIED":
          return {
            success: false,
            error: {
              type: "custom",
              message:
                "ایمیل شما هنوز تأیید نشده است. لطفاً ابتدا ایمیل خود را تأیید کنید.",
            },
          };

        case "INVALID_PASSWORD":
        case "USER_NOT_FOUND":
        case "CREDENTIALS_NOT_FOUND":
          return {
            success: false,
            error: {
              type: "custom",
              message: "ایمیل یا رمز عبور صحیح نیست",
            },
          };

        case "ACCOUNT_NOT_FOUND":
          return {
            success: false,
            error: {
              type: "custom",
              message: "حساب کاربری با این ایمیل یافت نشد",
            },
          };

        case "PASSWORD_COMPROMISED":
          return {
            success: false,
            error: {
              type: "custom",
              message: "رمز عبور شما امن نیست. لطفاً آن را تغییر دهید.",
            },
          };

        case "TOO_MANY_REQUESTS":
          return {
            success: false,
            error: {
              type: "custom",
              message: "تعداد درخواست‌ها زیاد است. لطفاً چند دقیقه صبر کنید.",
            },
          };

        default:
          console.error("❓ Unknown Better Auth error code:", errorCode);
          return {
            success: false,
            error: {
              type: "custom",
              message: `خطای ورود: ${errorCode || "نامشخص"}`,
            },
          };
      }
    }

    return {
      success: false,
      error: {
        type: "custom",
        message: `خطای ناشناخته: ${error?.message || "نامشخص"}`,
      },
    };
  }
}

// ------------------------------------------------------------------
// 3. خروج
// ------------------------------------------------------------------
export async function userSignOut() {
  try {
    await auth.api.signOut({
      headers: await headers(),
    });
  } catch (error) {
    console.error("userSignOut error:", error);
  }
}

// ------------------------------------------------------------------
// 4. ارسال ایمیل فراموشی رمز عبور
// ------------------------------------------------------------------
export async function sendResetPasswordEmailAction(
  email: string,
): Promise<ActionResult<string>> {
  const validated = forgotPasswordSchema.safeParse({ email });

  if (!validated.success) {
    return {
      success: false,
      error: {
        type: "zod",
        issues: validated.error.issues,
      },
    };
  }

  try {
    await auth.api.forgetPassword({
      body: {
        email: validated.data.email,
        redirectTo: "/reset-password",
      },
      headers: await headers(),
    });
  } catch (error) {
    // از نظر امنیتی حتی در صورت خطا هم پیام موفقیت می‌دهیم
    // تا مهاجمان نتوانند ایمیل‌های موجود را شناسایی کنند
    console.error("sendResetPasswordEmailAction error:", error);
  }

  // همیشه پیام موفقیت برمی‌گردانیم (به دلایل امنیتی)
  return {
    success: true,
    data: "در صورت وجود حساب کاربری، لینک بازیابی رمز عبور ارسال شد.",
  };
}

// ------------------------------------------------------------------
// 5. تغییر رمز عبور با توکن
// ------------------------------------------------------------------
export async function changePasswordAction(
  email: string, // برای سازگاری با فرم قدیمی نگه داشته شده ولی استفاده نمی‌شود
  token: string,
  newPassword: string,
): Promise<ActionResult<string>> {
  const validated = changePasswordSchema.safeParse({
    password: newPassword,
    confirmPassword: newPassword,
  });

  if (!validated.success) {
    return {
      success: false,
      error: {
        type: "zod",
        issues: validated.error.issues,
      },
    };
  }

  try {
    await auth.api.resetPassword({
      body: {
        token,
        newPassword: validated.data.password,
      },
      headers: await headers(),
    });

    return {
      success: true,
      data: "رمزعبور با موفقیت تغییر کرد",
    };
  } catch (error) {
    console.error("changePasswordAction error:", error);

    if (isAPIError(error)) {
      return {
        success: false,
        error: {
          type: "custom",
          message: "توکن معتبر نیست یا منقضی شده است.",
        },
      };
    }

    return {
      success: false,
      error: {
        type: "custom",
        message: "خطایی در تغییر رمزعبور رخ داد.",
      },
    };
  }
}
