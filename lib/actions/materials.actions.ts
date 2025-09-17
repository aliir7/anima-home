"use server";

import { db } from "@/db";
import { materials } from "@/db/schema/index";
import {
  ActionResult,
  Material,
  MaterialFormValues,
  QueryResult,
} from "@/types";
import { desc, eq } from "drizzle-orm";
import { insertMaterialSchema } from "../validations/materialsValidations";
import { revalidatePath } from "next/cache";

export async function getAllMaterials(): Promise<QueryResult<Material[]>> {
  try {
    const data = await db.query.materials.findMany({
      orderBy: (materials, { desc }) => [desc(materials.createdAt)],
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

export async function createMaterial(
  formData: MaterialFormValues,
): Promise<ActionResult<unknown>> {
  try {
    // validation data
    const validated = insertMaterialSchema.safeParse(formData);
    if (!validated.success) {
      return {
        success: false,
        error: {
          type: "zod",
          issues: validated.error.issues,
        },
      };
    }

    // if validation passed
    const { title } = validated.data;
    // checking new material not duplicated
    const [existing] = await db
      .select()
      .from(materials)
      .where(eq(materials.title, title));

    if (existing) {
      return {
        success: false,
        error: {
          type: "custom",
          message: "متریال با این عنوان از قبل وجود دارد",
        },
      };
    }

    // insert new material in db
    const [newMaterial] = await db
      .insert(materials)
      .values(formData)
      .returning();

    // revalidate pass
    revalidatePath("/admin/materials");

    return { success: true, data: newMaterial };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: { type: "custom", message: "خطایی در ایجاد متریال رخ داد" },
    };
  }
}

export async function deleteMaterial(id: string) {
  const [material] = await db
    .select()
    .from(materials)
    .where(eq(materials.id, id));

  if (!material) return;

  const fileKeys: string[] = [];

  if (
    material.image?.startsWith("https://anima-home.storage.c2.liara.space/")
  ) {
    fileKeys.push(
      material.image.replace("https://anima-home.storage.c2.liara.space/", ""),
    );
  }
  if (
    material.pdfUrl?.startsWith("https://anima-home.storage.c2.liara.space/")
  ) {
    fileKeys.push(
      material.pdfUrl.replace("https://anima-home.storage.c2.liara.space/", ""),
    );
  }

  if (fileKeys.length > 0) {
    await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/storage/delete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ keys: fileKeys }),
    });
  }

  await db.delete(materials).where(eq(materials.id, id));
  revalidatePath("/admin/materials");
}
