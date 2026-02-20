import z from "zod/v4";

//Cart item schema
export const cartItemSchema = z.object({
  productId: z.string().min(1, "شناسه محصول الزامی است"),
  variantId: z.string().optional(),
  name: z.string().min(1, "نام محصول محصول الزامی است"),
  slug: z.string().min(1, "slug الزامی است"),
  qty: z.number().int().nonnegative("تعداد باید عددی مثبت باشد"),
  image: z.string().min(1, "حداقل یک تصویر الزامی است"),
  price: z.number().int().nonnegative("قیمت باید عددی مثبت باشد"),
});

// Insert Cart Schema
export const insertCartSchema = z.object({
  items: z.array(cartItemSchema),
  itemsPrice: z.number().int().nonnegative("قیمت هر آیتم باید عددی مثبت باشد"),
  totalPrice: z.number().int().nonnegative("قیمت نهایی باید عددی مثبت باشد"),
  taxPrice: z.number().int().nonnegative("مالیات باید عددی مثبت باشد"),
  sessionCartId: z.string().min(1, "sessionCartId is required"),
  userId: z.string().optional().nullable(),
});
