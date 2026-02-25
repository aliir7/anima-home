import {
  integer,
  jsonb,
  pgTable,
  boolean,
  text,
  uuid,
  timestamp,
} from "drizzle-orm/pg-core";
import { users } from "./user";

export const orders = pgTable("orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  refNumber: text("ref_Number"),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  shippingAddress: jsonb("shipping_address").notNull(),
  paymentMethod: text("payment_method"),
  paymentResult: jsonb("payment_result"),
  itemsPrice: integer("items_price").notNull(),
  taxPrice: integer("tax_price").notNull(),
  totalPrice: integer("total_price").notNull(),
  isPaid: boolean("is_paid").default(false),
  isDelivered: boolean("is_ِdelivered").default(false),
  paidAt: timestamp("paid_at", { mode: "date", precision: 6 }),
  deliveredAt: timestamp("delivered_at", { mode: "date", precision: 6 }),
  createdAt: timestamp("created_at", { mode: "date", precision: 6 })
    .defaultNow()
    .notNull(),
});
