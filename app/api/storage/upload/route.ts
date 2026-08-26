import { getCurrentSession } from "@/lib/auth/authGuard";
import { s3 } from "@/lib/s3";
import { ALLOWED_STORAGE_FOLDERS } from "@/lib/services/storage.service";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";
import { extname } from "path";
import { v4 as uuid } from "uuid";

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
  "application/pdf",
  "video/mp4",
  "video/webm",
  "video/ogg",
  "video/quicktime",
];

const MAX_IMAGE_PDF_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_VIDEO_SIZE = 150 * 1024 * 1024; // 150MB
// حداکثر مطلقِ کل درخواست (چند فایل با هم) — برای رد کردن زودهنگام قبل از
// این‌که کل بدنه‌ی درخواست وارد حافظه‌ی سرور بشه (محافظت در برابر DoS حافظه)
const MAX_REQUEST_SIZE = MAX_VIDEO_SIZE + 5 * 1024 * 1024;

function maxSizeFor(mimeType: string) {
  return mimeType.startsWith("video/") ? MAX_VIDEO_SIZE : MAX_IMAGE_PDF_SIZE;
}

export async function POST(req: NextRequest) {
  try {
    // 🔒 چک دسترسی ادمین
    const session = await getCurrentSession();
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "دسترسی غیرمجاز" },
        { status: 403 },
      );
    }
    //   🔒 چک حجم کل درخواست (چند فایل با هم)
    const contentLength = Number(req.headers.get("content-length") || 0);
    if (contentLength > MAX_REQUEST_SIZE) {
      return NextResponse.json(
        { success: false, message: "حجم درخواست بیشتر از حد مجاز است" },
        { status: 413 },
      );
    }

    const formData = await req.formData();
    const files = formData.getAll("files") as File[];
    const folderInput = formData.get("folder")?.toString() || "";

    if (!ALLOWED_STORAGE_FOLDERS.includes(folderInput)) {
      return NextResponse.json(
        { success: false, message: "پوشه‌ی مقصد نامعتبر است" },
        { status: 400 },
      );
    }
    const folder = folderInput;

    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, message: "هیچ فایلی ارسال نشده است" },
        { status: 400 },
      );
    }

    for (const file of files) {
      if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        return NextResponse.json(
          { success: false, message: `نوع فایل مجاز نیست: ${file.type}` },
          { status: 400 },
        );
      }
      if (file.size > maxSizeFor(file.type)) {
        const maxMb = Math.round(maxSizeFor(file.type) / (1024 * 1024));
        return NextResponse.json(
          {
            success: false,
            message: `حجم فایل «${file.name}» بیشتر از حد مجاز (${maxMb} مگابایت) است`,
          },
          { status: 400 },
        );
      }
    }

    const results: { url: string; key: string }[] = [];

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const extension = extname(file.name);
      const fileName = `${folder}/${uuid()}${extension}`;

      const command = new PutObjectCommand({
        Bucket: process.env.ARVAN_BUCKET_NAME!,
        Key: fileName,
        Body: buffer,
        ContentType: file.type,
      });

      await s3.send(command);

      results.push({
        url: `${process.env.NEXT_PUBLIC_STORAGE_URL}/${fileName}`,
        key: fileName,
      });
    }

    return NextResponse.json({ success: true, files: results });
  } catch (error) {
    console.error("❌ خطا در API آپلود فایل:", error);
    return NextResponse.json(
      { success: false, message: "خطا در آپلود فایل" },
      { status: 500 },
    );
  }
}
