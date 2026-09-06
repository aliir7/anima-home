import { z } from "zod";

const optionalUrl = z
  .string()
  .trim()
  .refine((v) => v === "" || z.url().safeParse(v).success, {
    message: "آدرس معتبر نیست",
  })
  .optional()
  .transform((v) => (v === "" ? null : v));

const optionalText = z
  .string()
  .trim()
  .optional()
  .transform((v) => (v === "" ? null : v));

export const updateSiteSettingsSchema = z.object({
  phonePrimary: z
    .string()
    .trim()
    .regex(/^09\d{9}$/, "شماره موبایل معتبر نیست (مثال: 09123456789)")
    .optional()
    .or(z.literal(""))
    .transform((v) => (v === "" ? null : v)),
  phoneSecondary: z
    .string()
    .trim()
    .regex(/^09\d{9}$/, "شماره موبایل معتبر نیست")
    .optional()
    .or(z.literal(""))
    .transform((v) => (v === "" ? null : v)),
  email: z
    .string()
    .trim()
    .email("ایمیل معتبر نیست")
    .optional()
    .or(z.literal(""))
    .transform((v) => (v === "" ? null : v)),
  address: optionalText,
  instagramUrl: optionalUrl,
  telegramUrl: optionalUrl,
  whatsappUrl: optionalUrl,
  youtubeUrl: optionalUrl,
  aparatUrl: optionalUrl,
  bleUrl: optionalUrl,
});
