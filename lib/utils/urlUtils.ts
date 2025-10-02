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
