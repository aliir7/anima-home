import {
  pgTable,
  uuid,
  integer,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { products } from "./products";
import { users } from "./user";

export const reviews = pgTable(
  "reviews",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),

    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    rating: integer("rating").notNull(), // 1 تا 5
    comment: text("comment"),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    // هر کاربر برای هر محصول فقط یک نظر می‌تواند ثبت کند (حتی اگر چند بار خریده باشد)
    uniqueIndex("reviews_user_product_unique").on(
      table.userId,
      table.productId,
    ),
  ],
);
