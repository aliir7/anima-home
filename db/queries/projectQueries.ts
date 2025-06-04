import { eq } from "drizzle-orm";
import { db } from "..";
import { projects } from "../schema";
import { QueryResult } from "@/types";
import { console } from "inspector";

export async function getProjectById(
  id: string,
): Promise<QueryResult<(typeof projects.$inferSelect)[]>> {
  try {
    const data = await db.select().from(projects).where(eq(projects.id, id));

    return { success: true, data: data };
  } catch (error) {
    console.log("Error in ProjectById:", error);
    return { success: false, error: "خطا در گرفتن پروژه با آیدی" };
  }
}
