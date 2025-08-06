import { NextRequest, NextResponse } from "next/server";
import { s3 } from "@/lib/s3";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

export async function POST(req: NextRequest) {
  try {
    const { keys }: { keys: string[] } = await req.json();

    if (!keys || keys.length === 0) {
      return NextResponse.json(
        { error: "هیچ فایلی برای حذف ارسال نشده است" },
        { status: 400 },
      );
    }

    const results = await Promise.all(
      keys.map(async (key) => {
        const command = new DeleteObjectCommand({
          Bucket: process.env.LIARA_BUCKET_NAME!,
          Key: key,
        });

        await s3.send(command);

        return key;
      }),
    );

    return NextResponse.json({ success: true, deleted: results });
  } catch (error) {
    console.error("❌ خطا در API حذف فایل:", error);
    return NextResponse.json({ error: "خطا در حذف فایل‌ها" }, { status: 500 });
  }
}
