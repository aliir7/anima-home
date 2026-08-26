import { getCurrentSession } from "@/lib/auth/authGuard";
import { deleteStorageFiles } from "@/lib/services/storage.service";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // 🔒 چک دسترسی ادمین
    const session = await getCurrentSession();
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
    }

    const { keys }: { keys: string[] } = await req.json();

    if (!keys || keys.length === 0) {
      return NextResponse.json(
        { error: "هیچ فایلی برای حذف ارسال نشده است" },
        { status: 400 },
      );
    }

    const results = await deleteStorageFiles(keys);

    return NextResponse.json({ success: true, deleted: results });
  } catch (error) {
    console.error("❌ خطا در API حذف فایل:", error);
    const message =
      error instanceof Error ? error.message : "خطا در حذف فایل‌ها";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
