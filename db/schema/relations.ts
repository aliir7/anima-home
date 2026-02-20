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
import { orderItems } from "./orderItems";
import { orders } from "./order";

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
  orderItems: many(orderItems),
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
export const userRelations = relations(users, ({ one, many }) => ({
  account: one(accounts),
  session: one(sessions),
  authenticator: one(authenticators),
  cart: one(carts),
  orders: many(orders),
}));

// orders relations
export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }), // هر سفارش متعلق به یک کاربر است
  items: many(orderItems), // هر سفارش می‌تواند چندین آیتم داشته باشد
}));

// orderItems relations
export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }), // هر آیتم متعلق به یک سفارش خاص است
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }), // هر آیتم به یک محصول خاص اشاره می‌کند
}));
// sessions
export const sessionRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));
