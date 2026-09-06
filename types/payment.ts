import { PAYMENT_METHOD } from "@/lib/constants";
import {
  paymentMethodSchema,
  paymentResultSchema,
} from "@/lib/validations/orderValidations";
import z from "zod";

export type PaymentMethod =
  (typeof PAYMENT_METHOD)[keyof typeof PAYMENT_METHOD];

export type PaymentMethodFormValues = z.infer<typeof paymentMethodSchema>;
export type PaymentResult = z.infer<typeof paymentResultSchema>;
