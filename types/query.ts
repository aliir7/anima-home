// database queries types
export type QueryResult<T> =
  { success: true; data: T } | { success: false; error: string };

export type VerifyEmailResult =
  { success: true; message: string } | { success: false; message: string };
