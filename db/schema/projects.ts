import { pgTable, text, uuid, timestamp, jsonb } from "drizzle-orm/pg-core";
import { categories } from "./categories";

export const projects = pgTable("projects", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  slug: text("slug").notNull().unique(),
  seoSlug: text("seo_slug").notNull().unique().default(""),
  images: jsonb("images").notNull().default([]), // Array of image URLs
  videos: jsonb("videos").default([]), // Optional array of video URLs
  categoryId: uuid("category_id")
    .notNull()
    .references(() => categories.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});
