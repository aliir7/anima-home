import {
  pgTable,
  text,
  uuid,
  integer,
  boolean,
  timestamp,
  decimal,
} from "drizzle-orm/pg-core";
import { productCategories } from "./productCategories";

export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),

  categoryId: uuid("category_id")
    .references(() => productCategories.id)
    .notNull(),

  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  seoSlug: text("seo_slug").notNull().unique().default(""),

  description: text("description"),
  rating: decimal("rating", { precision: 2, scale: 1 })
    .default("0.0")
    .notNull(),

  numReviews: integer("num_reviews").default(0).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
