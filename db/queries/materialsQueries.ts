import { desc, eq, sql } from "drizzle-orm";
import { db } from "..";
import { materials } from "../schema/materials";
import { Material, QueryResult } from "@/types";

export async function getAllMaterials({
  page,
  pageSize,
}: {
  page?: number;
  pageSize?: number;
}): Promise<QueryResult<Material[]>> {
  try {
    const offset = ((page ?? 1) - 1) * (pageSize ?? 6);
    const data = await db.query.materials.findMany({
      orderBy: (projects, { desc }) => [desc(projects.createdAt)],
      limit: pageSize ?? 6,
      offset,
    });
    if (!data) {
      return { success: false, error: "خطا در دریافت اطلاعات رخ داد" };
    }
    return { success: true, data: data };
  } catch (error) {
    console.error("Error in getAllMaterials:", error);
    return { success: false, error: "خطا در گرفتن لیست متریال ها" };
  }
}

export async function getMaterialById(
  id: string,
): Promise<QueryResult<Material>> {
  try {
    const whereClause = id ? eq(materials.id, id) : undefined;
    const [material] = await db
      .select()
      .from(materials)
      .where(whereClause)
      .orderBy(desc(materials.createdAt));

    if (!material) {
      return { success: false, error: "خطا در دریافت اطلاعات رخ داد" };
    }
    return { success: true, data: material };
  } catch (error) {
    console.error("Error in getMaterialById:", error);
    return { success: false, error: "خطا در گرفتن متریال با شناسه" };
  }
}

// count
export async function getMaterialsCount(id?: string): Promise<number> {
  try {
    const whereClause = id ? eq(materials.id, id) : undefined;

    const result = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(materials)
      .where(whereClause);

    return Number(result[0]?.count ?? 0);
  } catch (error) {
    console.error("Error in getMaterialsCount:", error);
    return 0;
  }
}
