import { pgTable, uuid, integer, primaryKey, text } from "drizzle-orm/pg-core";
import { orders } from "./order";
import { products } from "./products";

export const orderItems = pgTable(
  "order_items",
  {
    orderId: uuid("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),

    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),

    qty: integer("qty").notNull(),
    price: integer("price").notNull(),
    name: text("name").notNull(),
    image: text("image").notNull(),
    slug: text("slug").notNull(),
  },
  // تغییر در این بخش: استفاده از آرایه [ ] به جای آبجکت { }
  (table) => [
    primaryKey({
      columns: [table.orderId, table.productId],
    }),
  ],
);
