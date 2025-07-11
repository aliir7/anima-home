import {
  pgTable,
  text,
  uuid,
  integer,
  boolean,
  timestamp,
  decimal,
} from "drizzle-orm/pg-core";

import { createInsertSchema } from "drizzle-zod";

export const products = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  category: text("category").notNull(),
  images: text("images").array().notNull(), // PostgreSQL array of text
  brand: text("brand").notNull(),
  description: text("description").notNull(),
  stock: integer("stock").notNull(),
  price: decimal("price", { precision: 12, scale: 2 }).notNull().default("0"),
  rating: decimal("rating", { precision: 3, scale: 2 }).notNull().default("0"),
  numReviews: integer("numReviews").notNull().default(0),
  isFeatured: boolean("isFeatured").notNull().default(false),
  banner: text("banner"),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
});

export const productSchema = createInsertSchema(products);
