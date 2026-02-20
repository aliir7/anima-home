import {
  pgTable,
  uuid,
  text,
  timestamp,
  json,
  varchar,
  boolean,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").default("NO_NAME"),
  email: text("email").notNull().unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  // -- اطلاعات موبایل (اضافه شده برای OTP آینده) --
  phone: varchar("phone", { length: 20 }).unique(),
  phoneVerified: timestamp("phoneVerified", { mode: "date" }), // 👈 فیلد جدید
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
