import { format as formatGregorian } from "date-fns";

/**
 * تبدیل تاریخ دیتابیس به Date object بدون تغییر روز تقویم به خاطر UTC.
 */
export function normalizeDate(date: Date | null | undefined): Date | null {
  if (!date) return null;
  const value = new Date(date);
  return new Date(value.getFullYear(), value.getMonth(), value.getDate());
}

/**
 * تبدیل Date به رشته تاریخ میلادی برای سرور.
 * مثال: Date -> "2026-09-11"
 */
export function toServerDate(date: Date | null): string | null {
  if (!date) return null;
  return formatGregorian(date, "yyyy-MM-dd");
}
