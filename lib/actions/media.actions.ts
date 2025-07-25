"use server";
import { unlink } from "fs/promises";
import { join } from "path";
import { ROOT_URL } from "../constants";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { v4 as uuid } from "uuid";

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

/**
 * حذف فایل از دیسک بر اساس آدرس `/media/...`
 */
export async function deleteFileFromDisk(fileUrl: string): Promise<boolean> {
  try {
    const url = new URL(fileUrl, ROOT_URL); // برای استخراج pathname
    const filePath = url.pathname; // /media/...

    const baseDir =
      process.env.NODE_ENV === "development"
        ? join(process.cwd(), "public")
        : "/app/uploads"; // چون فایل‌ها در /app/uploads/media/... ذخیره می‌شن

    // تبدیل /media/... به مسیر واقعی /app/uploads/media/...
    const realPath = filePath.replace(/^\/media/, ""); // فقط media رو حذف کن

    const fullPath = join(baseDir, realPath); // مسیر کامل نهایی

    await unlink(fullPath);
    return true;
  } catch (error) {
    console.error("خطا در حذف فایل:", error);
    return false;
  }
}
