import { s3 } from "@/lib/s3";
import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuid } from "uuid";
import { extname } from "path";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const files = formData.getAll("files") as File[];
  const folder = formData.get("folder")?.toString() || "uploads";

  const results: { url: string; key: string }[] = [];

  for (const file of files) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const extension = extname(file.name);
    const fileName = `${folder}/${uuid()}${extension}`;

    const command = new PutObjectCommand({
      Bucket: process.env.LIARA_BUCKET_NAME!,
      Key: fileName,
      Body: buffer,
      ContentType: file.type,
    });

    await s3.send(command);

    results.push({
      url: `${process.env.LIARA_ENDPOINT_PUBLIC_URL}/${fileName}`,
      key: fileName,
    });
  }

  return NextResponse.json({ success: true, files: results });
}
