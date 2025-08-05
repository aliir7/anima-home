import { NextResponse } from "next/server";
import { DeleteObjectsCommand } from "@aws-sdk/client-s3";
import { s3 } from "@/lib/s3";

export async function POST(req: Request) {
  try {
    const { keys } = await req.json();

    if (!Array.isArray(keys) || keys.length === 0) {
      return NextResponse.json({ error: "No keys provided" }, { status: 400 });
    }

    const command = new DeleteObjectsCommand({
      Bucket: process.env.LIARA_BUCKET_NAME,
      Delete: {
        Objects: keys.map((key: string) => ({ Key: key })),
      },
    });

    await s3.send(command);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete files from S3:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
