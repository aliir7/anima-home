// db/schema/materials.ts
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const materials = pgTable("materials", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(), // عنوان متریال
  description: text("description"), // توضیحات کوتاه
  image: text("image"), // تصویر پیش‌نمایش (jpg/png)
  pdfUrl: text("pdf_url").notNull(), // لینک فایل PDF در باکت
  createdAt: timestamp("created_at").defaultNow(),
});
