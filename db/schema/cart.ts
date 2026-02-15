import {
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
  integer,
} from "drizzle-orm/pg-core";
import { users } from "./user";

export const carts = pgTable("carts", {
  id: text("id").primaryKey(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .unique(),
  sessionCartId: text("sessionCartId"),
  items: jsonb("items").notNull().default([]),
  itemsPrice: integer("items_price").notNull(),
  taxPrice: integer("tax_price").notNull(),
  totalPrice: integer("total_price").notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});
