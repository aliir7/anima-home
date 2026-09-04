import { pgTable, uuid, timestamp } from "drizzle-orm/pg-core";
import { coupons } from "./coupons";
import { users } from "./user";
import { orders } from "./order";

// رکورد استفاده‌ی یک کاربر از یک کد تخفیف روی یک سفارش مشخص — برای
// اجرای محدودیت "هر کاربر حداکثر N بار" و ثبت سابقه‌ی استفاده
export const couponUsages = pgTable("coupon_usages", {
  id: uuid("id").defaultRandom().primaryKey(),

  couponId: uuid("coupon_id")
    .notNull()
    .references(() => coupons.id, { onDelete: "cascade" }),

  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  orderId: uuid("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),

  usedAt: timestamp("used_at", { mode: "date" }).defaultNow().notNull(),
});
