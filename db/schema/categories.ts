import { pgTable, text, uuid, timestamp } from "drizzle-orm/pg-core";

export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  parentId: uuid("parent_id").defaultRandom(),
  parentName: text("parent_name"), // فیلد جدید برای نام والد
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});
