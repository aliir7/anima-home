// db/schema/users.ts
import {
  pgTable,
  uuid,
  text,
  timestamp,
  json,
  varchar,
} from "drizzle-orm/pg-core";
import { accounts } from "./account";
import { sessions } from "./sessions";
import { authenticators } from "./authenticator";
import { relations } from "drizzle-orm/relations";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").default("NO_NAME"),
  email: text("email").notNull().unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  password: text("password"),
  role: text("role", { enum: ["user", "admin"] })
    .default("user")
    .notNull(),
  address: json("address"),
  paymentMethod: varchar("paymentMethod", { length: 128 }),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow(),
});

// relations
export const userRelations = relations(users, ({ one }) => {
  return {
    account: one(accounts),
    session: one(sessions),
    authenticator: one(authenticators),
  };
});
