-- migration_add_coupons.sql
--
-- این migration سیستم کد تخفیف را اضافه می‌کند: دو جدول جدید (coupons,
-- coupon_usages) + ستون‌های جدید روی carts و orders.
-- قبل از اجرا یک بک‌آپ از دیتابیس بگیرید.

BEGIN;

-- ==========================================================
-- ۱. Enum نوع تخفیف
-- ==========================================================
DO $$ BEGIN
  CREATE TYPE "coupon_type" AS ENUM ('percent', 'fixed');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- ==========================================================
-- ۲. جدول coupons
-- ==========================================================
CREATE TABLE IF NOT EXISTS "coupons" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "code" text NOT NULL UNIQUE,
  "type" "coupon_type" NOT NULL,
  "value" integer NOT NULL,
  "min_order_amount" integer,
  "max_uses" integer,
  "used_count" integer NOT NULL DEFAULT 0,
  "max_uses_per_user" integer,
  "expires_at" timestamp,
  "is_active" boolean NOT NULL DEFAULT true,
  "created_at" timestamp NOT NULL DEFAULT now(),
  "updated_at" timestamp NOT NULL DEFAULT now()
);

-- ==========================================================
-- ۳. جدول coupon_usages (ردیابی استفاده‌ی هر کاربر)
-- ==========================================================
CREATE TABLE IF NOT EXISTS "coupon_usages" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "coupon_id" uuid NOT NULL REFERENCES "coupons"("id") ON DELETE CASCADE,
  "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "order_id" uuid NOT NULL REFERENCES "orders"("id") ON DELETE CASCADE,
  "used_at" timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "coupon_usages_coupon_user_idx"
  ON "coupon_usages" ("coupon_id", "user_id");

-- ==========================================================
-- ۴. ستون‌های جدید روی carts
-- ==========================================================
ALTER TABLE "carts" ADD COLUMN IF NOT EXISTS "coupon_code" text;
ALTER TABLE "carts" ADD COLUMN IF NOT EXISTS "coupon_type" "coupon_type";
ALTER TABLE "carts" ADD COLUMN IF NOT EXISTS "coupon_value" integer;
ALTER TABLE "carts" ADD COLUMN IF NOT EXISTS "discount_amount" integer NOT NULL DEFAULT 0;

-- ==========================================================
-- ۵. ستون‌های جدید روی orders
-- ==========================================================
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "coupon_code" text;
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "discount_amount" integer NOT NULL DEFAULT 0;

COMMIT;
