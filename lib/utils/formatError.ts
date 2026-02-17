// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function formatError(error: any): string {
  // 🎯 Zod schema validation error
  if (error.name === "ZodError") {
    const messages = error.errors.map(
      (e: { path: string[]; message: string }) => {
        const field = e.path?.[0] ? `${e.path[0]}: ` : "";
        return `${field}${e.message}`;
      },
    );
    return messages.join(" | ");
  }

  // 🎯 Database unique constraint violation (Drizzle + Postgres)

  if (error.code === "23505") {
    // 23505 = unique_violation
    const field = error.detail?.match(/\((.*?)\)=/)?.[1] ?? "Field";
    return `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
  }

  // 🎯 سایر خطاهای شناخته‌شده یا custom throw‌ها
  if (typeof error.message === "string") return error.message;

  try {
    return JSON.stringify(error);
  } catch {
    return "Unknown error occurred";
  }
}
