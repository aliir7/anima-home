import { z } from "zod/v4";

// helpers
export const isUUID = (message = "شناسه معتبر نیست.") =>
  z
    .string()
    .refine(
      (val) =>
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(
          val,
        ),
      { message },
    );

export const isURL = (message = "لینک معتبر نیست.") =>
  z.string().refine(
    (val) => {
      try {
        new URL(val);
        return true;
      } catch {
        return false;
      }
    },
    { message },
  );

export const slugSchema = z
  .string()
  .trim()
  .min(3, "اسلاگ الزامی است")
  .regex(/^[a-z0-9-]+$/, "فقط حروف انگلیسی کوچک، اعداد و خط تیره مجاز است");
