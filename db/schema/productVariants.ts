import {
  pgTable,
  uuid,
  text,
  jsonb,
  integer,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";
import { products } from "./products";

export const productVariants = pgTable("product_variants", {
  id: uuid("id").defaultRandom().primaryKey(),

  productId: uuid("product_id")
    .references(() => products.id, { onDelete: "cascade" })
    .notNull(),

  sku: text("sku").notNull().unique(), // H303
  title: text("title").notNull(), // هود مخفی مدل H303

  price: integer("price").notNull(), // تومان
  discountPercent: integer("discount_percent").default(0).notNull(),
  stock: integer("stock").default(0).notNull(),

  specs: jsonb("specs").notNull(),
  // مشخصات فنی (آزاد)

  images: jsonb("images").notNull().default([]),
  isActive: boolean("is_active").default(true).notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});
