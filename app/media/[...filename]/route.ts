// app/media/[...filename]/route.ts
import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export const runtime = "nodejs"; // 👈 اجبار اجرای این route در Node.js Runtime

export async function GET(
  req: NextRequest,
  { params }: { params: { filename: string[] } },
) {
  const filename = params.filename;
  const filePath =
    process.env.NODE_ENV === "development"
      ? path.join(process.cwd(), "public/uploads/media", ...filename)
      : path.join("/app/uploads/media", ...filename);

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
    console.error("❌ Error serving media:", error);
    return new NextResponse("File not found", { status: 404 });
  }
}
