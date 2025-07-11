import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { users } from "./user";
import { relations } from "drizzle-orm/relations";

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: uuid("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});
