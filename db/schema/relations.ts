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
import { projectRedirects } from "./projectRedirects";
import { productCategories } from "./productCategories";
import { productVariants } from "./productVariants";

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

// projects
export const projectsRelations = relations(projects, ({ one, many }) => ({
  category: one(categories, {
    fields: [projects.categoryId],
    references: [categories.id],
  }),
  redirects: many(projectRedirects), // 👈 پروژه چند redirect دارد
}));

// projectRedirects
export const projectRedirectsRelations = relations(
  projectRedirects,
  ({ one }) => ({
    project: one(projects, {
      fields: [projectRedirects.projectId],
      references: [projects.id],
    }),
  }),
);

// Project categories
export const categoriesRelations = relations(categories, ({ many, one }) => ({
  projects: many(projects),
  parent: one(categories, {
    fields: [categories.parentId],
    references: [categories.id],
    relationName: "parent",
  }),
  children: many(categories, {
    relationName: "parent",
  }),
}));

// Product categories
export const productCategoriesRelations = relations(
  productCategories,
  ({ many, one }) => ({
    products: many(products),
    parent: one(productCategories, {
      fields: [productCategories.parentId],
      references: [productCategories.id],
      relationName: "parent",
    }),

    children: many(productCategories, {
      relationName: "parent",
    }),
  }),
);

// products relations
export const productRelations = relations(products, ({ one, many }) => ({
  category: one(productCategories, {
    fields: [products.categoryId],
    references: [productCategories.id],
  }),

  variants: many(productVariants),
}));

// products variants relations
export const productVariantRelations = relations(
  productVariants,
  ({ one }) => ({
    product: one(products, {
      fields: [productVariants.productId],
      references: [products.id],
    }),
  }),
);

// carts
export const cartRelations = relations(carts, ({ one }) => ({
  user: one(users, {
    fields: [carts.userId],
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

// sessions
export const sessionRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));
