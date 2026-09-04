import {
  pgTable,
  uuid,
  text,
  integer,
  boolean,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";

export const couponTypeEnum = pgEnum("coupon_type", ["percent", "fixed"]);

export const coupons = pgTable("coupons", {
  id: uuid("id").defaultRandom().primaryKey(),

  code: text("code").notNull().unique(),

  type: couponTypeEnum("type").notNull(),
  // برای percent: عددی بین ۱ تا ۱۰۰. برای fixed: مبلغ به تومان
  value: integer("value").notNull(),

  // حداقل مبلغ سبد خرید برای قابل‌استفاده بودن کد (اختیاری)
  minOrderAmount: integer("min_order_amount"),

  // حداکثر تعداد دفعات استفاده از این کد در کل سایت (خالی = نامحدود)
  maxUses: integer("max_uses"),
  usedCount: integer("used_count").default(0).notNull(),

  // حداکثر تعداد دفعات استفاده هر کاربر از این کد (خالی = نامحدود)
  maxUsesPerUser: integer("max_uses_per_user"),

  expiresAt: timestamp("expires_at", { mode: "date" }),
  isActive: boolean("is_active").default(true).notNull(),

  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});
