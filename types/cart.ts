import {
  cartItemSchema,
  insertCartSchema,
} from "@/lib/validations/cartValidations";
import z from "zod";

export type Cart = z.infer<typeof insertCartSchema> & {
  id: string;
  discountAmount?: number;
  couponCode?: string | null;
  couponType?: "percent" | "fixed" | null;
  couponValue?: number | null;
};
export type CartItem = z.infer<typeof cartItemSchema>;
