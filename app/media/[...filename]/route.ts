import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

// مسیر دیسک در توسعه و پروداکشن
const baseDir =
  process.env.NODE_ENV === "development"
    ? path.join(process.cwd(), "public/uploads/media")
    : "/app/uploads/media"; // مسیر mount شده دیسک در لیارا

export async function GET(
  req: NextRequest,
  { params }: { params: { filename: string[] } },
) {
  const filePath = path.join(baseDir, ...params.filename);

  try {
    const file = await fs.readFile(filePath);
    const ext = path.extname(filePath).toLowerCase();

    const contentType =
      {
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".png": "image/png",
        ".webp": "image/webp",
        ".gif": "image/gif",
        ".mp4": "video/mp4",
        ".mov": "video/quicktime",
      }[ext] || "application/octet-stream";

    return new NextResponse(file, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000",
      },
    });
  } catch (error) {
    console.error("❌ Media fetch error:", error);
    return new NextResponse("Not found", { status: 404 });
  }
}
