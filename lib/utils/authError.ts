import { isAPIError } from "better-auth/api";

/**
 * کدِ خطای Better Auth را از یک APIError استخراج می‌کند (مثلاً
 * "PHONE_NUMBER_EXIST" یا "INVALID_OTP") تا بشود پیام مناسب فارسی برای هر
 * کد نمایش داد. اگر خطا از نوع APIError نباشد، undefined برمی‌گرداند.
 */
export function getAuthErrorCode(error: unknown): string | undefined {
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
