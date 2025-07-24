// app/media/[...filename]/route.ts
import { readFile } from "fs/promises";
import { join } from "path";
import { NextRequest, NextResponse } from "next/server";
import mime from "mime";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ filename: string[] }> },
): Promise<NextResponse> {
  const { filename } = await context.params;
  const fileNamePath = filename.join("/");

  const baseDir =
    process.env.NODE_ENV === "development"
      ? join(process.cwd(), "public/uploads/media")
      : "/app/uploads/media";

  const filePath = join(baseDir, fileNamePath);

  try {
    const buffer = await readFile(filePath);

    // define file type
    const contentType = mime.getType(filePath || "application/octet-stream");
    return new NextResponse(buffer, {
      headers: { "Content-Type": contentType! },
      status: 200,
    });
  } catch {
    return new NextResponse("Not Found", { status: 404 });
  }
}
