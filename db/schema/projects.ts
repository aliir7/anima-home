import { pgTable, text, uuid, timestamp, jsonb } from "drizzle-orm/pg-core";
import { categories } from "./categories";
import { relations } from "drizzle-orm";

export const projects = pgTable("projects", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  slug: text("slug").notNull().unique(),
  images: jsonb("images").notNull().default([]), // Array of image URLs
  videos: jsonb("videos").default([]), // Optional array of video URLs
  categoryId: uuid("category_id")
    .notNull()
    .references(() => categories.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const projectsRelations = relations(projects, ({ one }) => ({
  category: one(categories, {
    fields: [projects.categoryId],
    references: [categories.id],
  }),
}));
