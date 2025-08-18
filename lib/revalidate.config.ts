export const REVALIDATE = {
  HOME: 3600, // 1 ساعت
  PRODUCTS_LIST: 300, // 5 دقیقه
  PRODUCT_DETAILS: 300, // 5 دقیقه
  CATEGORY_PAGE: 300, // 5 دقیقه
  PROJECTS_LIST: 600, // 10 دقیقه
  PROJECT_DETAILS: 600, // 10 دقیقه
  ABOUT_PAGE: 86400, // 1 روز
  CONTACT_PAGE: 86400, // 1 روز
};

export const DYNAMIC_PAGES = {
  AUTH: { dynamic: "force-dynamic" as const, revalidate: 0 },
  ACCOUNT: { dynamic: "force-dynamic" as const, revalidate: 0 },
  ADMIN: { dynamic: "force-dynamic" as const, revalidate: 0 },
};
