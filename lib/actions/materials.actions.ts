"use server";

import { db } from "@/db";
import { materials } from "@/db/schema/materials";
import { eq } from "drizzle-orm";

export async function getMaterials() {
  return await db.select().from(materials).orderBy(materials.createdAt);
}

export async function getMaterialById(id: string) {
  return await db.select().from(materials).where(eq(materials.id, id));
}

export async function createMaterial(data: {
  title: string;
  description?: string;
  image?: string;
  pdfUrl: string;
}) {
  return await db.insert(materials).values(data).returning();
}

export async function deleteMaterial(id: string) {
  return await db.delete(materials).where(eq(materials.id, id));
}
