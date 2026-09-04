import {
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
  integer,
} from "drizzle-orm/pg-core";
import { users } from "./user";
import { couponTypeEnum } from "./coupons";

export const carts = pgTable("carts", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .unique(),
  sessionCartId: text("sessionCartId"),
  items: jsonb("items").notNull().default([]),
  itemsPrice: integer("items_price").notNull(),
  taxPrice: integer("tax_price").notNull(),
  totalPrice: integer("total_price").notNull(),

  // کد تخفیف اعمال‌شده روی این سبد (اگر باشد)
  couponCode: text("coupon_code"),
  couponType: couponTypeEnum("coupon_type"),
  couponValue: integer("coupon_value"),
  discountAmount: integer("discount_amount").default(0).notNull(),

  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});
