import { pgTable, uuid, integer, text } from "drizzle-orm/pg-core";
import { orders } from "./order";
import { products } from "./products";
import { productVariants } from "./productVariants";

export const orderItems = pgTable("order_items", {
  // شناسه سروگیت: چون variantId می‌تواند بعداً null شود (حذف واریانت)،
  // نمی‌تواند عضو کلید اصلی باشد؛ کلید ترکیبی قدیمی (orderId, productId)
  // هم اجازه نمی‌داد یک سفارش شامل چند واریانت از یک محصول باشد.
  id: uuid("id").defaultRandom().primaryKey(),

  orderId: uuid("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),

  productId: uuid("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  variantId: uuid("variantId").references(() => productVariants.id, {
    onDelete: "set null",
  }),

  qty: integer("qty").notNull(),
  price: integer("price").notNull(),
  name: text("name").notNull(),
  image: text("image").notNull(),
  slug: text("slug").notNull(),
});
