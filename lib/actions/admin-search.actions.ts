"use server";

import { db } from "@/db";
import {
  coupons,
  materials,
  orders,
  products,
  projects,
  users,
} from "@/db/schema";
import { requireAdmin } from "@/lib/auth/authGuard";
import { ActionResult, AdminSearchResult } from "@/types";
import { ilike, or } from "drizzle-orm";
import { z } from "zod";

const adminSearchSchema = z.string().trim().min(1).max(100);

const MAX_RESULTS_PER_TYPE = 3;

/**
 * Escape PostgreSQL ILIKE wildcard characters.
 *
 * Without this, "%" and "_" entered by the user would behave
 * as wildcards and could turn a narrow search into a broad query.
 */
function escapeLikePattern(value: string): string {
  return value.replace(/[\\%_]/g, "\\$&");
}

export async function searchAdminAction(
  query: string,
): Promise<ActionResult<AdminSearchResult[]>> {
  try {
    // 🔒 Authorization must be checked inside the Server Action.
    await requireAdmin();

    const validation = adminSearchSchema.safeParse(query);

    if (!validation.success) {
      return {
        success: false,
        error: {
          type: "zod",
          issues: validation.error.issues,
        },
      };
    }

    const normalizedQuery = validation.data;
    const pattern = `%${escapeLikePattern(normalizedQuery)}%`;

    const [
      productResults,
      userResults,
      orderResults,
      couponResults,
      materialResults,
      projectResults,
    ] = await Promise.all([
      // ============================================================
      // PRODUCTS
      // ============================================================
      db
        .select({
          id: products.id,
          title: products.title,
          brand: products.brand,
          seoSlug: products.seoSlug,
        })
        .from(products)
        .where(
          or(
            ilike(products.title, pattern),
            ilike(products.brand, pattern),
            ilike(products.seoSlug, pattern),
          ),
        )
        .limit(MAX_RESULTS_PER_TYPE),

      // ============================================================
      // USERS
      // ============================================================
      db
        .select({
          id: users.id,
          name: users.name,
          email: users.email,
          phoneNumber: users.phoneNumber,
        })
        .from(users)
        .where(
          or(
            ilike(users.name, pattern),
            ilike(users.email, pattern),
            ilike(users.phoneNumber, pattern),
          ),
        )
        .limit(MAX_RESULTS_PER_TYPE),

      // ============================================================
      // ORDERS
      // ============================================================
      db
        .select({
          id: orders.id,
          refNumber: orders.refNumber,
        })
        .from(orders)
        .where(ilike(orders.refNumber, pattern))
        .limit(MAX_RESULTS_PER_TYPE),

      // ============================================================
      // COUPONS
      // ============================================================
      db
        .select({
          id: coupons.id,
          code: coupons.code,
        })
        .from(coupons)
        .where(ilike(coupons.code, pattern))
        .limit(MAX_RESULTS_PER_TYPE),

      // ============================================================
      // MATERIALS
      // ============================================================
      db
        .select({
          id: materials.id,
          title: materials.title,
        })
        .from(materials)
        .where(ilike(materials.title, pattern))
        .limit(MAX_RESULTS_PER_TYPE),

      // ============================================================
      // PROJECTS
      // ============================================================
      db
        .select({
          id: projects.id,
          title: projects.title,
          seoSlug: projects.seoSlug,
        })
        .from(projects)
        .where(
          or(ilike(projects.title, pattern), ilike(projects.seoSlug, pattern)),
        )
        .limit(MAX_RESULTS_PER_TYPE),
    ]);

    const results: AdminSearchResult[] = [
      // ------------------------------------------------------------
      // Products
      // ------------------------------------------------------------
      ...productResults.map((product) => ({
        id: product.id,
        title: product.title,
        description: product.brand,
        type: "product" as const,
        href: `/admin/products/${product.id}`,
      })),

      // ------------------------------------------------------------
      // Users
      // ------------------------------------------------------------
      ...userResults.map((user) => ({
        id: user.id,
        title: user.name || user.email || user.phoneNumber || "کاربر",
        description: user.email || user.phoneNumber || undefined,
        type: "user" as const,
        href: `/admin/users?query=${encodeURIComponent(
          user.email || user.phoneNumber || user.name || "",
        )}`,
      })),

      // ------------------------------------------------------------
      // Orders
      // ------------------------------------------------------------
      ...orderResults.map((order) => ({
        id: order.id,
        title: order.refNumber || "سفارش",
        description: "سفارش",
        type: "order" as const,
        href: `/admin/orders?query=${encodeURIComponent(
          order.refNumber || "",
        )}`,
      })),

      // ------------------------------------------------------------
      // Coupons
      // ------------------------------------------------------------
      ...couponResults.map((coupon) => ({
        id: coupon.id,
        title: coupon.code,
        description: "کد تخفیف",
        type: "coupon" as const,
        href: `/admin/coupons?query=${encodeURIComponent(coupon.code)}`,
      })),

      // ------------------------------------------------------------
      // Materials
      // ------------------------------------------------------------
      ...materialResults.map((material) => ({
        id: material.id,
        title: material.title,
        description: "متریال",
        type: "material" as const,
        href: `/admin/materials?query=${encodeURIComponent(material.title)}`,
      })),

      // ------------------------------------------------------------
      // Projects
      // ------------------------------------------------------------
      ...projectResults.map((project) => ({
        id: project.id,
        title: project.title,
        description: project.seoSlug || "پروژه",
        type: "project" as const,
        href: `/admin/projects?query=${encodeURIComponent(project.title)}`,
      })),
    ];

    return {
      success: true,
      data: results,
    };
  } catch (error) {
    console.error("Admin search error:", error);

    return {
      success: false,
      error: {
        type: "custom",
        message: "خطا در انجام جستجو",
      },
    };
  }
}
