import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";

// یک جدول singleton (همیشه فقط یک ردیف) برای اطلاعات تماس و لینک‌های
// شبکه‌ی اجتماعی سایت — تا مدیر بتواند بدون نیاز به تغییر کد و دیپلوی
// مجدد، این‌ها را ویرایش کند.
export const siteSettings = pgTable("site_settings", {
  id: uuid("id").defaultRandom().primaryKey(),

  phonePrimary: text("phone_primary"),
  phoneSecondary: text("phone_secondary"),
  email: text("email"),
  address: text("address"),

  instagramUrl: text("instagram_url"),
  telegramUrl: text("telegram_url"),
  whatsappUrl: text("whatsapp_url"),
  youtubeUrl: text("youtube_url"),
  aparatUrl: text("aparat_url"),
  bleUrl: text("ble_url"),

  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});
