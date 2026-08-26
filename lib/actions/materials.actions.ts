"use server";

import { db } from "@/db";
import { materials } from "@/db/schema/index";
import {
  ActionResult,
  MaterialFormValues,
  UpdateMaterialValues,
} from "@/types";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "../auth/authGuard";
import {
  deleteStorageFiles,
  extractStorageKey,
} from "../services/storage.service";
import { insertMaterialSchema } from "../validations/materialsValidations";

// create new material action
export async function createMaterial(
  formData: MaterialFormValues,
): Promise<ActionResult<unknown>> {
  try {
    // 🔒 این عملیات فقط برای ادمین مجاز است
    await requireAdmin();

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

    // revalidate path
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

export async function deleteMaterial(
  id: string,
): Promise<ActionResult<string>> {
  try {
    // 🔒 این عملیات فقط برای ادمین مجاز است
    await requireAdmin();

    const [material] = await db
      .select()
      .from(materials)
      .where(eq(materials.id, id));

    if (!material) {
      return {
        success: false,
        error: { type: "custom", message: "متریال یافت نشد" },
      };
    }

    // delete files from bucket — مستقیم از سرویس داخلی
    const fileKeys = [material.image, material.pdfUrl]
      .filter((url): url is string => typeof url === "string")
      .map(extractStorageKey)
      .filter((key): key is string => key !== null);

    if (fileKeys.length > 0) {
      await deleteStorageFiles(fileKeys);
    }

    // delete material from db
    await db.delete(materials).where(eq(materials.id, id));
    revalidatePath("/admin/materials");

    return { success: true, data: "متریال با موفقیت حذف شد" };
  } catch (error) {
    console.error("❌ خطا در حذف پروژه:", error);
    return {
      success: false,
      error: { type: "custom", message: "خطا در حذف متریال رخ داد" },
    };
  }
}

// update material action
export async function updateMaterial(
  formData: UpdateMaterialValues,
  id: string,
): Promise<ActionResult<string>> {
  try {
    // 🔒 این عملیات فقط برای ادمین مجاز است
    await requireAdmin();

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

    // checking for find material
    const [existing] = await db
      .select()
      .from(materials)
      .where(eq(materials.id, id));
    if (!existing) {
      return {
        success: false,
        error: { type: "custom", message: "متریال یافت نشد" },
      };
    }

    // update material
    await db
      .update(materials)
      .set({ ...validated.data })
      .where(eq(materials.id, id));

    // revalidate path
    revalidatePath("/admin/materials");

    return { success: true, data: "متریال با موفقیت ویرایش شد" };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: { type: "custom", message: "خطا در ویرایش متریال رخ داد" },
    };
  }
}
