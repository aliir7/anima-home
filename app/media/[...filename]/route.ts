// app/media/[...filename]/route.ts
import { readFile } from "fs/promises";
import { join } from "path";
import { NextRequest, NextResponse } from "next/server";

// پارامترها رو مستقیم اینجا تایپ کن
type Params = { filename: string[] };

export async function GET(_req: NextRequest, { params }: { params: Params }) {
  const filenameParts = params?.filename;

  if (!filenameParts || filenameParts.length === 0) {
    return new NextResponse("نام فایل ارسال نشده", { status: 400 });
  }

  const fullPath = join(
    process.env.NODE_ENV === "development"
      ? process.cwd() + "/public/uploads/media"
      : "/app/uploads/media",
    ...filenameParts,
  );

  try {
    const fileBuffer = await readFile(fullPath);
    const ext = filenameParts.at(-1)?.split(".").pop() || "";
    const mimeType = getMimeType(ext);

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": mimeType,
      },
    });
  } catch (error) {
    console.error("❌ File not found:", fullPath, error);
    return new NextResponse("Not Found", { status: 404 });
  }
}

function getMimeType(ext: string): string {
  switch (ext.toLowerCase()) {
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
