import { writeFile } from "fs/promises";
import { join } from "path";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { nanoid } from "nanoid";

// مسیر دیسک mount شده در لیارا
const uploadDir = join("/uploads/media");

export async function POST(req: NextRequest) {
  const token = await getToken({ req });

  if (!token || token.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file || file.size === 0) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const extension = file.name.split(".").pop();
  const filename = `${nanoid()}.${extension}`;
  const filePath = join(uploadDir, filename);

  await writeFile(filePath, buffer);

  return NextResponse.json({
    url: `/uploads/media/${filename}`,
  });
}
