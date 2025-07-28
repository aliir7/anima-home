"use server";

import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { v4 as uuid } from "uuid";
import fs from "fs/promises";

/**
 * آپلود فایل و برگشت مسیر عمومی (`/media/...`)
 */
export async function uploadMedia(
  formData: FormData,
  folderName: string = "media",
): Promise<string | null> {
  const file = formData.get("file") as File;
  if (!file || file.size === 0) return null;

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const ext = file.name.split(".").pop();
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
  formData: FormData,
  folderName: string = "media",
): Promise<string[]> {
  const files = formData.getAll("files") as File[];

  if (!files.length) return [];

  const isDev = process.env.NODE_ENV === "development";
  const uploadBase = isDev
    ? path.join(process.cwd(), "public", "media", folderName)
    : `/app/uploads/media/${folderName}`;

  await mkdir(uploadBase, { recursive: true });

  const uploadedPaths: string[] = [];

  for (const file of files) {
    if (!file || file.size === 0) continue;
    if (file.size > MAX_FILE_SIZE) continue;

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

export async function deleteFileFromDisk(fileUrl: string) {
  try {
    const filePath = path.join(process.cwd(), "public", fileUrl);
    await fs.unlink(filePath);
  } catch (error) {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    if ((error as any)?.code === "ENOENT") {
      console.warn("⚠️ فایل وجود ندارد:", fileUrl);
    } else {
      console.error("❌ خطا در حذف فایل:", error);
    }
  }
}
