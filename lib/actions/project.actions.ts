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
    await db.delete(projects).where(eq(projects.id, id));

    // revalidatePath after delete item
    revalidatePath("/admin/projects");
    return { success: true, data: "پروژه با موفقیت حذف شد" };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: { type: "custom", message: "خطا در حذف پروژه" },
    };
  }
}
