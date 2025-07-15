// app/media/[...filename]/route.ts

import { readFile } from "fs/promises";
import { join } from "path";
import { NextRequest, NextResponse } from "next/server";

// ❗ این تایپ دوم دقیقا باید این باشه
export async function GET(
  req: NextRequest,
  context: { params: { filename: string[] } },
) {
  const { filename } = context.params;

  const filePath = join(
    process.env.NODE_ENV === "development"
      ? process.cwd() + "/public/uploads/media"
      : "/app/uploads/media", // مسیر mount شده در لیارا
    ...filename,
  );

  try {
    const fileBuffer = await readFile(filePath);
    const ext = filename.at(-1)?.split(".").pop()?.toLowerCase();
    const mimeType = getMimeType(ext ?? "bin");

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": mimeType,
      },
    });
  } catch (error) {
    console.error("❌ File not found:", filePath, error);
    return new NextResponse("Not Found", { status: 404 });
  }
}

function getMimeType(ext: string): string {
  switch (ext) {
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "gif":
      return "image/gif";
    case "webp":
      return "image/webp";
    case "mp4":
      return "video/mp4";
    default:
      return "application/octet-stream";
  }
}
