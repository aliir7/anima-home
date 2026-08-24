import {
  index,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

import { users } from "./user";

export const sessions = pgTable(
  "session",
  {
    id: text("id").primaryKey(),

    userId: uuid("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    token: text("token").notNull(),

    expiresAt: timestamp("expiresAt", {
      mode: "date",
    }).notNull(),

    ipAddress: text("ipAddress"),

    userAgent: text("userAgent"),

    createdAt: timestamp("createdAt", {
      mode: "date",
    })
      .defaultNow()
      .notNull(),

    updatedAt: timestamp("updatedAt", {
      mode: "date",
    })
      .defaultNow()
      .notNull(),
  },
  (session) => [
    uniqueIndex("session_token_idx").on(session.token),

    index("session_userId_idx").on(session.userId),
  ],
);
