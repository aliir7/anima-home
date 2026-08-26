import { headers } from "next/headers";

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

// هر ۱۰ دقیقه ورودی‌های منقضی‌شده را پاک می‌کنیم تا حافظه به‌مرور پر نشود
if (typeof setInterval !== "undefined") {
  setInterval(
    () => {
      const now = Date.now();
      for (const [key, bucket] of buckets) {
        if (bucket.resetAt < now) buckets.delete(key);
      }
    },
    10 * 60 * 1000,
  ).unref?.();
}

async function getClientIp(): Promise<string> {
  const h = await headers();
  const forwardedFor = h.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return h.get("x-real-ip") || "unknown";
}

export type RateLimitResult = {
  allowed: boolean;
  retryAfterSeconds: number;
};

/**
 * @param action نام یکتای عملیات (مثلاً "signin", "send-otp")
 * @param options.windowMs بازه‌ی زمانی به میلی‌ثانیه
 * @param options.max حداکثر تعداد مجاز در این بازه
 * @param identifier شناسه‌ی سفارشی (مثلاً شماره موبایل/ایمیل). اگر ندهید،
 *   IP کاربر به‌عنوان شناسه استفاده می‌شود.
 */
export async function checkRateLimit(
  action: string,
  { windowMs, max }: { windowMs: number; max: number },
  identifier?: string,
): Promise<RateLimitResult> {
  const id = identifier || (await getClientIp());
  const key = `${action}:${id}`;
  const now = Date.now();

  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (bucket.count >= max) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
    };
  }

  bucket.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}

export function rateLimitMessage(retryAfterSeconds: number): string {
  if (retryAfterSeconds < 60) {
    return `تعداد تلاش‌های شما بیش از حد مجاز است. لطفاً ${retryAfterSeconds} ثانیه دیگر دوباره امتحان کنید.`;
  }
  const minutes = Math.ceil(retryAfterSeconds / 60);
  return `تعداد تلاش‌های شما بیش از حد مجاز است. لطفاً ${minutes} دقیقه دیگر دوباره امتحان کنید.`;
}
