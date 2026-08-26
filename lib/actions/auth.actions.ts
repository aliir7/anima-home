"use server";

import { isAPIError } from "better-auth/api";
import { headers } from "next/headers";

import type { ActionResult, SigninValues, SignupFormValues } from "@/types";
import { auth } from "../auth";
import {
  changePasswordSchema,
  forgotPasswordSchema,
  signinSchema,
  signupFormSchema,
} from "../validations/usersValidations";

// ------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------

function getAuthErrorCode(error: unknown): string | undefined {
  if (!isAPIError(error)) return undefined;

  if (typeof error.body === "object" && error.body !== null) {
    return (error.body as Record<string, unknown>).code as string | undefined;
  }

  if (typeof error.body === "string") {
    try {
      const parsed = JSON.parse(error.body);
      return parsed?.code;
    } catch {
      return undefined;
    }
  }

  return undefined;
}

/**
 * تبدیل کد خطا به پیام مناسب برای کاربر
 */
function getAuthErrorMessage(code?: string): string {
  // 🆕 برای debugging کدهای ناشناخته
  if (code && process.env.NODE_ENV === "development") {
    console.log(`[Auth Error Code]: ${code}`);
  }

  switch (code) {
    case "EMAIL_NOT_VERIFIED":
      return "ایمیل شما هنوز تأیید نشده است. لطفاً ابتدا ایمیل خود را تأیید کنید.";

    // ✅ اضافه شد: INVALID_EMAIL_OR_PASSWORD
    case "INVALID_EMAIL_OR_PASSWORD":
    case "INVALID_PASSWORD":
    case "USER_NOT_FOUND":
    case "CREDENTIALS_NOT_FOUND":
    case "ACCOUNT_NOT_FOUND":
      return "ایمیل یا رمز عبور صحیح نیست.";

    case "TOO_MANY_REQUESTS":
      return "تعداد درخواست‌ها زیاد است. لطفاً کمی بعد دوباره تلاش کنید.";

    case "EMAIL_NOT_ALLOWED":
      return "ورود با این ایمیل مجاز نیست.";

    case "FAILED_TO_CREATE_SESSION":
      return "خطا در ایجاد نشست. لطفاً دوباره تلاش کنید.";

    default:
      // 🆕 لاگ کدهای ناشناخته برای شناسایی سریع‌تر
      if (code) {
        console.warn(`[Unhandled Auth Error Code]: ${code}`);
      }
      return "ورود انجام نشد. لطفاً دوباره تلاش کنید.";
  }
}
// ------------------------------------------------------------------
// Sign up
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

    const errorCode = getAuthErrorCode(error);

    if (errorCode === "USER_ALREADY_EXISTS") {
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
}

// ------------------------------------------------------------------
// Sign in with email/password
// ------------------------------------------------------------------
export async function signinWithCredentials(
  formData: SigninValues,
): Promise<ActionResult<string>> {
  // ۱. اعتبارسنجی داده‌ها
  const validated = signinSchema.safeParse(formData);

  if (!validated.success) {
    return {
      success: false,
      error: {
        type: "zod",
        issues: validated.error.issues,
      },
    };
  }

  const { email, password } = validated.data;

  try {
    // ۲. تلاش برای ورود
    await auth.api.signInEmail({
      body: { email, password },
      headers: await headers(),
    });

    // ۳. بازگشت پاسخ موفقیت‌آمیز (با قابلیت ریدایرکت)
    return {
      success: true,
      message: "با موفقیت وارد شدید.",
    };
  } catch (error) {
    console.error("signinWithCredentials error:", error);

    // ۴. مدیریت خطا و بازگشت پیام سفارشی
    const errorCode = getAuthErrorCode(error);
    const errorMessage = getAuthErrorMessage(errorCode);

    return {
      success: false,
      error: {
        type: "custom",
        message: errorMessage,
      },
    };
  }
}

// export async function signinWithCredentials(
//   formData: SigninValues,
// ): Promise<ActionResult<string>> {
//   const validated = signinSchema.safeParse(formData);

//   if (!validated.success) {
//     return {
//       success: false,
//       error: {
//         type: "zod",
//         issues: validated.error.issues,
//       },
//     };
//   }

//   const { email, password } = validated.data;

//   try {
//     await auth.api.signInEmail({
//       body: {
//         email,
//         password,
//       },
//       headers: await headers(),
//     });

//     return {
//       success: true,
//       data: "با موفقیت وارد شدید.",
//     };
//   } catch (error) {
//     console.error("signinWithCredentials error:", error);

//     const errorCode = getAuthErrorCode(error);

//     switch (errorCode) {
//       case "EMAIL_NOT_VERIFIED":
//         return {
//           success: false,
//           error: {
//             type: "custom",
//             message:
//               "ایمیل شما هنوز تأیید نشده است. لطفاً ابتدا ایمیل خود را تأیید کنید.",
//           },
//         };

//       case "INVALID_PASSWORD":
//       case "USER_NOT_FOUND":
//       case "CREDENTIALS_NOT_FOUND":
//       case "ACCOUNT_NOT_FOUND":
//         return {
//           success: false,
//           error: {
//             type: "custom",
//             message: "ایمیل یا رمز عبور صحیح نیست.",
//           },
//         };

//       case "TOO_MANY_REQUESTS":
//         return {
//           success: false,
//           error: {
//             type: "custom",
//             message:
//               "تعداد درخواست‌ها زیاد است. لطفاً کمی بعد دوباره تلاش کنید.",
//           },
//         };

//       default:
//         return {
//           success: false,
//           error: {
//             type: "custom",
//             message: "ورود انجام نشد. لطفاً دوباره تلاش کنید.",
//           },
//         };
//     }
//   }
// }

// ------------------------------------------------------------------
// Sign out
// ------------------------------------------------------------------

export async function userSignOut(): Promise<void> {
  try {
    await auth.api.signOut({
      headers: await headers(),
    });
  } catch (error) {
    console.error("userSignOut error:", error);
  }
}

// ------------------------------------------------------------------
// Forgot password
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
    // عمداً پیام موفقیت برمی‌گردانیم تا وجود/عدم وجود ایمیل
    // از طریق پاسخ endpoint قابل تشخیص نباشد.
    console.error("sendResetPasswordEmailAction error:", error);
  }

  return {
    success: true,
    data: "در صورت وجود حساب کاربری، لینک بازیابی رمز عبور ارسال شد.",
  };
}

// ------------------------------------------------------------------
// Reset password
// ------------------------------------------------------------------

export async function changePasswordAction(
  _email: string,
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
      data: "رمز عبور با موفقیت تغییر کرد.",
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
        message: "خطایی در تغییر رمز عبور رخ داد.",
      },
    };
  }
}
