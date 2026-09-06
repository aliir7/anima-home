-- migration_add_site_settings.sql
--
-- جدول singleton برای اطلاعات تماس و لینک‌های شبکه‌ی اجتماعی سایت که
-- قبلاً در کد hardcode بودند (Footer.tsx, SocialLinks.tsx, contact/page.tsx).
-- قبل از اجرا یک بک‌آپ از دیتابیس بگیرید.

BEGIN;

CREATE TABLE IF NOT EXISTS "site_settings" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "phone_primary" text,
  "phone_secondary" text,
  "email" text,
  "address" text,
  "instagram_url" text,
  "telegram_url" text,
  "whatsapp_url" text,
  "youtube_url" text,
  "aparat_url" text,
  "ble_url" text,
  "updated_at" timestamp NOT NULL DEFAULT now()
);

-- یک ردیف اولیه با همان مقادیری که تا الان hardcode بودند می‌سازیم —
-- تا سایت بلافاصله بعد از این migration دقیقاً همان چیزی را نشان بدهد
-- که قبلاً نشان می‌داد (نه خالی)، و مدیر بعداً از پنل می‌تواند ویرایشش کند.
INSERT INTO "site_settings"
  ("phone_primary", "phone_secondary", "email", "instagram_url", "telegram_url", "whatsapp_url", "youtube_url", "aparat_url", "ble_url")
SELECT
  '09128184930', '09129277302', 'info@anima-home.ir',
  'https://www.instagram.com/anima.home.ir',
  'https://telegram.me/AnimaHomeDecor',
  'https://wa.me/989129277302',
  'https://www.youtube.com/@Anima-HomeOfficial',
  'https://www.aparat.com/animahome.ir/',
  'https://ble.ir/AnimaHome'
WHERE NOT EXISTS (SELECT 1 FROM "site_settings");

COMMIT;
