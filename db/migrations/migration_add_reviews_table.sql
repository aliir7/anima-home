-- migration_add_reviews_table.sql
--
-- این migration جدول جدید "reviews" را برای سیستم نظر/امتیاز محصولات اضافه می‌کند.
-- قبل از اجرا یک بک‌آپ از دیتابیس بگیرید (طبق روال قبلی).

BEGIN;

CREATE TABLE IF NOT EXISTS "reviews" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "product_id" uuid NOT NULL REFERENCES "products"("id") ON DELETE CASCADE,
  "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "rating" integer NOT NULL,
  "comment" text,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT "reviews_rating_check" CHECK ("rating" >= 1 AND "rating" <= 5)
);

-- هر کاربر برای هر محصول فقط یک نظر می‌تواند ثبت کند
CREATE UNIQUE INDEX IF NOT EXISTS "reviews_user_product_unique"
  ON "reviews" ("user_id", "product_id");

-- برای سریع‌تر شدن کوئری «نظرات یک محصول را بیاور»
CREATE INDEX IF NOT EXISTS "reviews_product_id_idx" ON "reviews" ("product_id");

COMMIT;
