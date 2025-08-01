"use client";

import { uploadMedia, uploadMultipleMedia } from "@/lib/actions/media.actions";

export async function uploadSingleFile(
  file: File,
  folder: string,
): Promise<string> {
  const url = await uploadMedia(file, folder);
  if (!url) throw new Error("Upload failed: no URL returned.");
  return url;
}

// چند فایل
export async function multipleUploadClient(
  files: File[],
  folder: string,
): Promise<string[]> {
  const urls = await uploadMultipleMedia(files, folder);
  if (!urls || urls.length === 0) throw new Error("Multiple upload failed.");
  return urls;
}
