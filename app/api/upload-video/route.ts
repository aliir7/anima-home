import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

const ALLOWED_VIDEO_TYPES = [
  "video/mp4",
  "video/webm",
  "video/ogg",
  "video/quicktime",
  "video/x-matroska", // .mkv
];

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file || !ALLOWED_VIDEO_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "فرمت فایل ویدیویی مجاز نیست." },
      { status: 400 },
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const extension = file.name.split(".").pop();
  const filename = `${Date.now()}-${randomUUID()}.${extension}`;
  const uploadPath = path.join(process.cwd(), "uploads/media", filename);

  try {
    await writeFile(uploadPath, buffer);
    return NextResponse.json(
      { url: `/uploads/media/${filename}` },
      { status: 200 },
    );
  } catch (error) {
    console.error("خطا در ذخیره فایل:", error);
    return NextResponse.json({ error: "خطا در ذخیره فایل" }, { status: 500 });
  }
}
