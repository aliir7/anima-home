import z from "zod";
// server action results types
export type ActionError =
  | { type: "zod"; issues: z.ZodError["issues"] }
  | { type: "custom"; message: string };
export type ActionResult<T> =
  | { success: true; data?: T; redirectTo?: string; message?: string }
  | {
      success: false;
      error: ActionError;
      redirectTo?: string;
      message?: string;
    };
