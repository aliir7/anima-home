"use server";

import { db } from "@/db";
import { siteSettings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { cache } from "react";

import { ActionResult } from "@/types";
import { requireAdmin } from "../auth/authGuard";
import { updateSiteSettingsSchema } from "../validations/settingsValidations";
import { formatError } from "../utils/formatError";

// مقادیر پیش‌فرض — اگر هنوز هیچ ردیفی در دیتابیس ساخته نشده باشد
// (مثلاً بلافاصله بعد از اجرای migration)، سایت با همین مقادیر فعلی
// (که قبلاً hardcode بودند) کار می‌کند، نه با فیلدهای خالی.
const DEFAULT_SETTINGS = {
  phonePrimary: "09128184930",
  phoneSecondary: "09129277302",
  email: "info@anima-home.ir",
  address: null as string | null,
  instagramUrl: "https://www.instagram.com/anima.home.ir",
  telegramUrl: "https://telegram.me/AnimaHomeDecor",
  whatsappUrl: "https://wa.me/989129277302",
  youtubeUrl: "https://www.youtube.com/@Anima-HomeOfficial",
  aparatUrl: "https://www.aparat.com/animahome.ir/",
  bleUrl: "https://ble.ir/AnimaHome",
};

// خواندن تنظیمات سایت — عمومی است (فوتر/صفحه‌ی تماس همه از این استفاده می‌کنند)
export const getSiteSettings = cache(async () => {
  try {
    const row = await db.query.siteSettings.findFirst();
    return row ?? DEFAULT_SETTINGS;
  } catch (error) {
    console.error("getSiteSettings error:", error);
    return DEFAULT_SETTINGS;
  }
});

// به‌روزرسانی تنظیمات — چون این یک جدول singleton است، یا ردیف موجود را
// آپدیت می‌کنیم یا (فقط برای اولین بار) یکی می‌سازیم
export async function updateSiteSettings(data: unknown): Promise<ActionResult<string>> {
  try {
    await requireAdmin();

    const validated = updateSiteSettingsSchema.safeParse(data);
    if (!validated.success) {
      return {
        success: false,
        error: { type: "zod", issues: validated.error.issues },
      };
    }

    const existing = await db.query.siteSettings.findFirst({
      columns: { id: true },
    });

    if (existing) {
      await db
        .update(siteSettings)
        .set(validated.data)
        .where(eq(siteSettings.id, existing.id));
    } else {
      await db.insert(siteSettings).values(validated.data);
    }

    revalidatePath("/admin/settings");
    revalidatePath("/"); // فوتر در همه‌ی صفحات هست
    revalidatePath("/contact");

    return { success: true, data: "تنظیمات با موفقیت ذخیره شد" };
  } catch (error) {
    return {
      success: false,
      error: { type: "custom", message: formatError(error) },
    };
  }
}
