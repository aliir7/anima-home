import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "./user";
import { relations } from "drizzle-orm/relations";
import { products } from "./product";

export const carts = pgTable("cart", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" })
    .unique(), // هر کاربر فقط یک cart
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const cartRelations = relations(carts, ({ one, many }) => ({
  user: one(users, {
    fields: [carts.userId],
    references: [users.id],
  }),
  products: many(products),
}));
