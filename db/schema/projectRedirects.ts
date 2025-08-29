// db/schema/projectRedirects.ts
import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { projects } from "./projects";

export const projectRedirects = pgTable("project_redirects", {
  id: uuid("id").defaultRandom().primaryKey(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  oldSlug: text("old_slug").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});
