import { eq } from "drizzle-orm";
import { db } from "..";
import { projects } from "../schema";

export async function getProjectById(id: string) {
  const [project] = await db.select().from(projects).where(eq(projects.id, id));
  return project ?? null;
}
