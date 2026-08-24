import {
  boolean,
  json,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),

  name: text("name").default("NO_NAME"),

  email: text("email").unique(),

  // Better Auth
  emailVerified: boolean("emailVerified").default(false).notNull(),

  // Preserve the old verification timestamp
  emailVerifiedAt: timestamp("emailVerifiedAt", {
    mode: "date",
  }),

  image: text("image"),

  password: text("password"),

  role: text("role", { enum: ["user", "admin"] })
    .default("user")
    .notNull(),

  // Better Auth Phone Number plugin (canonical field name — do not rename)
  phoneNumber: varchar("phoneNumber", { length: 20 }).unique(),

  // Better Auth Phone Number plugin
  phoneNumberVerified: boolean("phoneNumberVerified").default(false).notNull(),

  // Legacy/business data - keep for now
  phoneVerifiedAt: timestamp("phoneVerified", { mode: "date" }),

  address: json("address"),

  paymentMethod: varchar("paymentMethod", { length: 128 }),

  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow(),

  updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow(),
});
