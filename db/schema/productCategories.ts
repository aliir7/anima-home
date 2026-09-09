import {
  pgTable,
  uuid,
  text,
  boolean,
  integer,
  timestamp,
  AnyPgColumn,
} from "drizzle-orm/pg-core";

export const productCategories = pgTable("product_categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  parentId: uuid("parent_id").references(
    (): AnyPgColumn => productCategories.id,
    { onDelete: "restrict" },
  ),
  // یادداشت: کش نمایشی نام والد - فقط برای نمایش سریع در جدول‌ها.
  // منبع صحت، رابطه‌ی parent (از طریق parentId) است.
  parentName: text("parent_name"),
  isActive: boolean("is_active").default(true).notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
