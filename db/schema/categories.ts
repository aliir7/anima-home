import { pgTable, text, uuid, timestamp } from "drizzle-orm/pg-core";
import { projects } from "./projects";
import { products } from "./product";
import { relations } from "drizzle-orm";

export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  // self-referencing field for parent category
  // this allows for hierarchical categories
  parentId: uuid("parent_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const categoriesRelations = relations(categories, ({ many, one }) => ({
  projects: many(projects),
  products: many(products),
  parent: one(categories, {
    fields: [categories.parentId],
    references: [categories.id],
    relationName: "parent",
  }),
  children: many(categories, {
    relationName: "parent",
  }),
}));
