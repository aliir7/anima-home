import { relations } from "drizzle-orm/relations";
import { accounts } from "./account";
import { users } from "./user";
import { authenticators } from "./authenticator";
import { carts } from "./cart";
import { products } from "./product";
import { projects } from "./projects";
import { categories } from "./categories";
import { sessions } from "./sessions";

export const accountRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));

export const authenticatorRelations = relations(authenticators, ({ one }) => ({
  user: one(users, {
    fields: [authenticators.userId],
    references: [users.id],
  }),
}));

export const cartRelations = relations(carts, ({ one, many }) => ({
  user: one(users, {
    fields: [carts.userId],
    references: [users.id],
  }),
  products: many(products),
}));

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

export const productRelations = relations(products, ({ many }) => ({
  carts: many(carts),
}));

export const projectsRelations = relations(projects, ({ one }) => ({
  category: one(categories, {
    fields: [projects.categoryId],
    references: [categories.id],
  }),
}));

export const sessionRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const userRelations = relations(users, ({ one }) => {
  return {
    account: one(accounts),
    session: one(sessions),
    authenticator: one(authenticators),
    cart: one(carts),
  };
});
