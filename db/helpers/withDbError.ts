import { QueryResult } from "@/types";

export async function withDbError<T>(
  fn: () => Promise<T>,
  message: string,
): Promise<QueryResult<T>> {
  try {
    const data = await fn();

    return {
      success: true,
      data,
    };
  } catch (err) {
    console.error(err);

    return {
      success: false,
      error: message,
    };
  }
}
