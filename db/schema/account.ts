import {
  pgTable,
  text,
  timestamp,
  uuid,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";

import { users } from "./user";

export const accounts = pgTable(
  "account",
  {
    id: text("id").primaryKey(),

    userId: uuid("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    issuer: text("issuer").notNull(),

    accountId: text("accountId").notNull(),

    providerId: text("providerId").notNull(),

    accessToken: text("accessToken"),

    refreshToken: text("refreshToken"),

    accessTokenExpiresAt: timestamp("accessTokenExpiresAt", {
      mode: "date",
    }),

    refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt", {
      mode: "date",
    }),

    scope: text("scope"),

    idToken: text("idToken"),

    password: text("password"),

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
  (account) => [
    uniqueIndex("account_issuer_accountId_idx").on(
      account.issuer,
      account.accountId,
    ),

    index("account_userId_idx").on(account.userId),
  ],
);
