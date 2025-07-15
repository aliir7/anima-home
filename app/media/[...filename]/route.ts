// app/media/[...filename]/route.ts
import { readFile } from "fs/promises";
import { join } from "path";
import { NextResponse } from "next/server";

// نکته مهم: استفاده از destructuring مستقیم `params` داخل آرگومان مجاز نیست!
export async function GET(
  request: Request,
  context: { params: { filename: string[] } },
) {
  const { filename } = context.params;
  const filePath = join(
    process.env.NODE_ENV === "development"
      ? process.cwd() + "/public/uploads/media"
      : "/app/uploads/media",
    ...filename,
  );

  try {
    const fileBuffer = await readFile(filePath);
    const ext = filename.at(-1)?.split(".").pop()?.toLowerCase();

    // تعیین نوع MIME
    const mimeType = getMimeType(ext ?? "bin");
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": mimeType,
      },
    });
  } catch (error) {
    console.log(error);
    console.error("File not found:", filePath);
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
    case "webp":
      return "image/webp";
    case "gif":
      return "image/gif";
    case "mp4":
      return "video/mp4";
    default:
      return "application/octet-stream";
  }
}
