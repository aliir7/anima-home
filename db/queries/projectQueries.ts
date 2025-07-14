import { ProjectWithCategory, QueryResult } from "@/types";
import { db } from "..";
import { projects } from "../schema/projects";
import { normalizeProject } from "@/lib/utils/normalize";
import { eq } from "drizzle-orm";

export async function getAllProjects(): Promise<
  QueryResult<ProjectWithCategory[]>
> {
  try {
    const data = await db.query.projects.findMany({
      with: {
        category: true,
        // گرفتن دسته‌بندی مربوطه با relation
      },
      orderBy: (projects, { desc }) => [desc(projects.createdAt)],
    });

    const normalized = (data as Partial<ProjectWithCategory>[]).map(
      normalizeProject,
    );

    return { success: true, data: normalized };
  } catch (error) {
    console.error("Error in getAllProjects:", error);
    return {
      success: false,
      error: "خطا در گرفتن لیست پروژه‌ها",
    };
  }
}

export async function getProjectById(
  id: string,
): Promise<QueryResult<ProjectWithCategory[]>> {
  try {
    const data = await db.select().from(projects).where(eq(projects.id, id));

    const normalized = (data as Partial<ProjectWithCategory>[]).map(
      normalizeProject,
    );
    return { success: true, data: normalized };
  } catch (error) {
    console.log("Error in ProjectById:", error);
    return { success: false, error: "خطا در گرفتن پروژه با آیدی" };
  }
}
