"use server";

import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { v4 as uuid } from "uuid";

export async function uploadMedia(formData: FormData): Promise<string | null> {
  const file = formData.get("file") as File;
  if (!file || file.size === 0) return null;

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const ext = file.name.split(".").pop();
  const filename = `${uuid()}.${ext}`;

  const uploadBase =
    process.env.NODE_ENV === "development"
      ? path.join(process.cwd(), "public/uploads/media")
      : "/app/uploads/media"; // مسیر mount شده دیسک در لیارا

  const filePath = path.join(uploadBase, filename);

  try {
    // 🔥 پوشه رو ایجاد کن اگر وجود نداره
    await mkdir(uploadBase, { recursive: true });

    await writeFile(filePath, buffer);

    return `/uploads/media/${filename}`;
  } catch (err) {
    console.error("upload error:", err);
    return null;
  }
}
