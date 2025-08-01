"use server";

import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { v4 as uuid } from "uuid";
import fs from "fs/promises";

/**
 * آپلود فایل و برگشت مسیر عمومی (`/media/...`)
 */
export async function uploadMedia(
  file: File,
  folderName: string = "media",
): Promise<string | null> {
  if (!file || file.size === 0) return null;
  const ext = file.name.split(".").pop();
  const allowed = ["jpg", "jpeg", "png", "webp", "mp4"];
  if (!ext || !allowed.includes(ext)) return null;
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const filename = `${uuid()}.${ext}`;

  const isDev = process.env.NODE_ENV === "development";

  // مسیر واقعی ذخیره فایل
  const uploadBase = isDev
    ? path.join(process.cwd(), "public", "media", folderName)
    : `/app/uploads/media/${folderName}`;

  const filePath = path.join(uploadBase, filename);

  try {
    await mkdir(uploadBase, { recursive: true });
    await writeFile(filePath, buffer);

    // ✅ مسیر عمومی که کلاینت بتونه بهش دسترسی داشته باشه
    return `/media/${folderName}/${filename}`;
  } catch (err) {
    console.error("upload error:", err);
    return null;
  }
}

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "webp", "mp4"];

export async function uploadMultipleMedia(
  files: File[],
  folderName: string = "media",
): Promise<string[]> {
  if (!files.length) return [];

  const isDev = process.env.NODE_ENV === "development";
  const uploadBase = isDev
    ? path.join(process.cwd(), "public", "media", folderName)
    : `/app/uploads/media/${folderName}`;

  await mkdir(uploadBase, { recursive: true });

  const uploadedPaths: string[] = [];

  for (const file of files) {
    if (!file || file.size === 0 || file.size > MAX_FILE_SIZE) continue;

    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!ext || !ALLOWED_EXTENSIONS.includes(ext)) continue;

    try {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `${uuid()}.${ext}`;
      const filePath = path.join(uploadBase, filename);

      await writeFile(filePath, buffer);

      // مسیر عمومی برای دسترسی از کلاینت
      uploadedPaths.push(`/media/${folderName}/${filename}`);
    } catch (err) {
      console.error("upload error for one file:", err);
      continue;
    }
  }

  return uploadedPaths;
}

/**
 * حذف فایل از دیسک بر اساس آدرس `/media/...`
 */
export async function deleteFileFromDisk(fileUrl: string): Promise<boolean> {
  const isDev = process.env.NODE_ENV === "development";

  // حذف پیشوند `/media/` و استخراج مسیر نسبی
  const relativePath = fileUrl.replace(/^\/media\//, "");

  // در حالت dev از public/media/... و در حالت production از uploads/media/... استفاده کن
  const filePath = isDev
    ? path.join(process.cwd(), "public", "media", relativePath)
    : path.join("/app/uploads/media", relativePath);

  try {
    await fs.unlink(filePath);
    return true;
  } catch (error) {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    if ((error as any)?.code === "ENOENT") {
      console.warn("⚠️ فایل وجود ندارد:", fileUrl);
      return false;
    } else {
      console.error("❌ خطا در حذف فایل:", error);
      return false;
    }
  }
}
