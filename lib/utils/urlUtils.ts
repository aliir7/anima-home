export function sanitizeUrl(url: string) {
  if (!url || typeof url !== "string") return url;

  let u = url.trim();

  // normalize multiple slashes (keep protocol)
  u = u.replace(/([^:]\/)\/+/g, "$1");

  // remove trailing empty query / fragment separators like ?, &, #, +
  u = u.replace(/[?&#\+]+$/g, "");

  // remove trailing special characters like & or $ (common bad cases)
  u = u.replace(/[&$]+$/g, "");

  // replace spaces with encoded space
  u = u.replace(/\s+/g, "%20");

  return u;
}

export function getStorageUrl(path?: string | null) {
  if (!path || typeof path !== "string") return "";

  const value = path.trim();
  if (!value) return "";

  // اگر URL کامل است، همان را برگردان
  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }

  // اگر مسیر local/public است، همان را برگردان
  // مثال: /images/placeholder.svg
  if (value.startsWith("/")) {
    return value;
  }

  const base = process.env.NEXT_PUBLIC_STORAGE_URL?.trim();

  // اگر base نداریم، بهتر است مسیر خام برنگردد چون ممکن است برای next/image نامعتبر باشد
  if (!base) return "";

  return `${base.replace(/\/$/, "")}/${value.replace(/^\//, "")}`;
}

const PLACEHOLDER_IMAGE = "/images/placeholder.svg";

export function getSafeImageSrc(src?: string | null) {
  const url = getStorageUrl(src);

  if (!url) return PLACEHOLDER_IMAGE;

  if (url.startsWith("/")) return url;

  try {
    const parsedUrl = new URL(url);

    if (parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:") {
      return url;
    }

    return PLACEHOLDER_IMAGE;
  } catch {
    return PLACEHOLDER_IMAGE;
  }
}
