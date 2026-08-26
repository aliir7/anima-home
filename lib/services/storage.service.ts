// lib/services/storage.service.ts
//
// این فایل عمداً "use server" ندارد و یک Server Action نیست — یک تابع
// داخلی معمولی است. علتش این است که چند Server Action دیگر (مثلاً
// deleteProductAction) نیاز دارند بعد از حذف رکورد دیتابیس، فایل‌های
// مرتبط را هم از فضای ابری پاک کنند. قبلاً این کار را با یک fetch به
// endpoint عمومی /api/storage/delete انجام می‌دادند — اما چون این یک
// فراخوانی سرور-به-سرور بود، کوکی سشن ادمین را همراه نمی‌کرد و بعد از
// اضافه‌شدن چک احراز هویت به آن endpoint، این فراخوانی‌ها همیشه با خطای
// ۴۰۳ مواجه می‌شدند. راه‌حل درست: خودِ منطق حذف را اینجا نگه داریم و هم
// endpoint عمومی و هم Server Actionهای داخلی مستقیماً همین تابع را صدا
// بزنند — بدون HTTP round-trip غیرضروری به خودمان.

import { s3 } from "@/lib/s3";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

export const ALLOWED_STORAGE_FOLDERS = [
  "projects",
  "products",
  "materials/images",
  "materials/pdfs",
];

// همیشه از همین متغیر محیطی استفاده کنید — همان چیزی که در upload/route.ts
// برای ساخت URL فایل‌های تازه‌آپلودشده استفاده می‌شود. (نکته: قبلاً سه جای
// مختلف کد یک آدرس Liara قدیمی و از‌کارافتاده را hardcode کرده بودند که
// باعث می‌شد حذف فایل روی هیچ‌کدام از عکس‌های فعلی -که روی ArvanCloud
// هستند- اصلاً match نشود و بی‌سروصدا نادیده گرفته شود.)
export function extractStorageKey(url: string): string | null {
  const bucketUrl = process.env.NEXT_PUBLIC_STORAGE_URL;
  if (!bucketUrl || !url.startsWith(bucketUrl)) return null;
  return url.replace(`${bucketUrl}/`, "");
}

export async function deleteStorageFiles(keys: string[]) {
  if (!keys || keys.length === 0) return [];

  const invalidKey = keys.find(
    (key) =>
      !ALLOWED_STORAGE_FOLDERS.some((folder) => key.startsWith(`${folder}/`)),
  );
  if (invalidKey) {
    throw new Error(`مسیر فایل مجاز نیست: ${invalidKey}`);
  }

  return Promise.all(
    keys.map(async (key) => {
      const command = new DeleteObjectCommand({
        Bucket: process.env.ARVAN_BUCKET_NAME!,
        Key: key,
      });
      await s3.send(command);
      return key;
    }),
  );
}
