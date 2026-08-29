import { readFile } from "fs/promises";
import { join, normalize, resolve, sep } from "path";
import { NextRequest, NextResponse } from "next/server";
import mime from "mime";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ filename: string[] }> },
): Promise<NextResponse> {
  const { filename } = await context.params;
  const fileNamePath = filename.join("/");

  const baseDir = resolve(
    process.env.NODE_ENV === "development"
      ? join(process.cwd(), "public/uploads/media")
      : "/app/uploads/media",
  );

  // 🔒 حیاتی: مسیر نهایی را resolve/normalize می‌کنیم و مطمئن می‌شویم هنوز
  // داخل baseDir است. بدون این چک، یک filename حاوی "../" می‌توانست به هر
  // فایل دیگری روی سرور (خارج از پوشه‌ی uploads) دسترسی پیدا کند.
  const filePath = resolve(baseDir, normalize(fileNamePath));

  if (filePath !== baseDir && !filePath.startsWith(baseDir + sep)) {
    return new NextResponse("Not Found", { status: 404 });
  }

  try {
    const buffer = await readFile(filePath);

    // define file type
    const contentType = mime.getType(filePath || "application/octet-stream");
    return new NextResponse(new Uint8Array(buffer), {
      headers: { "Content-Type": contentType! },
      status: 200,
    });
  } catch {
    return new NextResponse("Not Found", { status: 404 });
  }
}
