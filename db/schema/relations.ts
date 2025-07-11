// db/schema/relations.ts
import { relations } from "drizzle-orm";
import { accounts } from "./account";
import { authenticators } from "./authenticator";
import { carts } from "./cart";
import { categories } from "./categories";
import { products } from "./products";
import { projects } from "./projects";
import { sessions } from "./sessions";
import { users } from "./user";

// accounts
export const accountRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));

// authenticators
export const authenticatorRelations = relations(authenticators, ({ one }) => ({
  user: one(users, {
    fields: [authenticators.userId],
    references: [users.id],
  }),
}));

// carts
export const cartRelations = relations(carts, ({ one }) => ({
  user: one(users, {
    fields: [carts.userId],
    references: [users.id],
  }),
}));

// categories
export const categoriesRelations = relations(categories, ({ many, one }) => ({
  projects: many(projects),
  products: many(products),
  parent: one(categories, {
    fields: [categories.parentId],
    references: [categories.id],
    relationName: "parent",
  }),
  children: many(categories, {
    relationName: "parent",
  }),
}));

// products
export const productRelations = relations(products, ({ one }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
}));

// projects
export const projectsRelations = relations(projects, ({ one }) => ({
  category: one(categories, {
    fields: [projects.categoryId],
    references: [categories.id],
  }),
}));

// sessions
export const sessionRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

// users
export const userRelations = relations(users, ({ one }) => ({
  account: one(accounts),
  session: one(sessions),
  authenticator: one(authenticators),
  cart: one(carts),
}));
