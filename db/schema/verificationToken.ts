import {
  pgTable,
  text,
  timestamp,
  primaryKey,
  serial,
} from "drizzle-orm/pg-core";

export const verificationTokens = pgTable(
  "verificationToken",
  {
    id: serial("id").primaryKey(),
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => [
    {
      compositePk: primaryKey({
        columns: [verificationToken.identifier, verificationToken.token],
      }),
    },
  ],
);
