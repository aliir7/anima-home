"use server";

import {
  ActionResult,
  InsertProjectValues,
  UpdateProjectValues,
} from "@/types";
import {
  insertProjectSchema,
  updateProjectSchema,
} from "../validations/projectsValidations";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { generateUniqueSlug } from "../utils/generateSlug";
import { ROOT_URL } from "../constants";
import { deleteFileFromDisk } from "./media.actions";

// action for create project
export async function createProject(
  data: InsertProjectValues,
): Promise<ActionResult<unknown>> {
  try {
    // validation data
    const validated = insertProjectSchema.safeParse(data);
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
    // checking new project not duplicated
    const [existing] = await db
      .select()
      .from(projects)
      .where(eq(projects.title, title));

    if (existing) {
      return {
        success: false,
        error: {
          type: "custom",
          message: "پروژه با این عنوان از قبل وجود دارد",
        },
      };
    }

    const slug = await generateUniqueSlug(title);
    const [newProject] = await db
      .insert(projects)
      .values({
        ...data,
        slug,
      })
      .returning();

    revalidatePath("admin/projects");
    return { success: true, data: newProject };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: { type: "custom", message: "خطایی در ایجاد پروژه رخ داد" },
    };
  }
}

// update project action
export async function updateProject(
  id: string,
  values: UpdateProjectValues,
): Promise<ActionResult<string>> {
  try {
    // validation update values
    const validated = updateProjectSchema.safeParse(values);
    if (!validated.success) {
      return {
        success: false,
        error: {
          type: "zod",
          issues: validated.error.issues,
        },
      };
    }

    // update project with id in database
    await db.update(projects).set(validated.data).where(eq(projects.id, id));
    revalidatePath("/admin/projects");
    return { success: true, data: "پروژه با موفقیت ویرایش شد" };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: { type: "custom", message: "خطا در ویرایش پروژه" },
    };
  }
}

// delete project action
export async function deleteProject(id: string): Promise<ActionResult<string>> {
  try {
    // ابتدا پروژه را بگیر تا به تصاویر و ویدیوها دسترسی داشته باشیم
    const [project] = await db
      .select()
      .from(projects)
      .where(eq(projects.id, id));

    if (project) {
      const allMedia: string[] = [
        ...((project.images as string[]) || []),
        ...((project.videos as string[]) || []),
      ];

      // حذف همه فایل‌های مربوط به پروژه از دیسک
      for (const url of allMedia) {
        if (typeof url === "string" && url.trim() !== "") {
          await deleteFileFromDisk(`${ROOT_URL}${url}`);
        }
      }
    }

    // حذف رکورد پروژه از دیتابیس
    await db.delete(projects).where(eq(projects.id, id));

    // بازسازی مسیر برای آپدیت UI
    revalidatePath("/admin/projects");

    return { success: true, data: "پروژه با موفقیت حذف شد" };
  } catch (error) {
    console.error("خطا در حذف پروژه:", error);
    return {
      success: false,
      error: { type: "custom", message: "خطا در حذف پروژه" },
    };
  }
}
