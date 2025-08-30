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
    const { title, seoSlug } = validated.data;
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

    // چک کردن یکتا بودن seoSlug
    const [existingSeo] = await db
      .select()
      .from(projects)
      .where(eq(projects.seoSlug, seoSlug));

    if (existingSeo) {
      return {
        success: false,
        error: { type: "custom", message: "این SEO Slug قبلا استفاده شده است" },
      };
    }

    const slug = await generateUniqueSlug(title);

    const [newProject] = await db
      .insert(projects)
      .values({
        ...data,
        slug,
        seoSlug: seoSlug,
      })
      .returning();

    revalidatePath("/admin/projects");
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
    // اعتبارسنجی داده‌ها
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

    const { seoSlug, title } = validated.data;

    // پیدا کردن پروژه فعلی
    const [existing] = await db
      .select()
      .from(projects)
      .where(eq(projects.id, id));
    if (!existing) {
      return {
        success: false,
        error: { type: "custom", message: "پروژه یافت نشد" },
      };
    }

    // اگر seoSlug تغییر کرده بود چک کنیم یکتا باشه
    if (seoSlug && seoSlug !== existing.seoSlug) {
      const [seoExists] = await db
        .select()
        .from(projects)
        .where(eq(projects.seoSlug, seoSlug));

      if (seoExists) {
        return {
          success: false,
          error: {
            type: "custom",
            message: "این SEO Slug قبلا استفاده شده است",
          },
        };
      }
    }

    let newSlug = existing.slug;

    if (
      title &&
      title !== existing.title &&
      seoSlug &&
      seoSlug !== existing.seoSlug
    ) {
      newSlug = await generateUniqueSlug(title);
    }

    await db
      .update(projects)
      .set({
        ...validated.data,
        slug: newSlug,
        seoSlug: seoSlug,
      })
      .where(eq(projects.id, id));

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

//delete project action
export async function deleteProject(id: string): Promise<ActionResult<string>> {
  try {
    const [project] = await db
      .select()
      .from(projects)
      .where(eq(projects.id, id));

    if (!project) {
      return {
        success: false,
        error: { type: "custom", message: "پروژه یافت نشد" },
      };
    }

    const images: string[] = Array.isArray(project.images)
      ? project.images
      : [];
    const videos: string[] = Array.isArray(project.videos)
      ? project.videos
      : [];

    // فقط فایل‌هایی که روی باکت ذخیره شدن حذف می‌کنیم
    const BUCKET_URL = "https://anima-home.storage.c2.liara.space/";

    const extractKey = (url: string) => url.replace(BUCKET_URL, "");

    // فقط لینک‌هایی که با آدرس باکت شروع میشن
    const fileKeys = [...images, ...videos]
      .filter((url) => url.startsWith(BUCKET_URL))
      .map(extractKey);

    if (fileKeys.length > 0) {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/storage/delete`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ keys: fileKeys }),
        },
      );

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "خطا در حذف فایل‌ها");
      }
    }

    await db.delete(projects).where(eq(projects.id, id));
    revalidatePath("/admin/projects");

    return { success: true, data: "پروژه با موفقیت حذف شد" };
  } catch (error) {
    console.error("❌ خطا در حذف پروژه:", error);
    return {
      success: false,
      error: { type: "custom", message: "خطا در حذف پروژه" },
    };
  }
}
