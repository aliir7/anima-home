import z from "zod";
import {
  insertOrderItemSchema,
  insertOrderSchema,
} from "@/lib/validations/orderValidations";
import { PaymentResult } from "./payment";

export type CreateOrderValues = z.infer<typeof insertOrderSchema>;
export type OrderItem = z.infer<typeof insertOrderItemSchema>;
export type Order = z.infer<typeof insertOrderSchema> & {
  id: string;
  createdAt: Date;
  isPaid: boolean;
  paidAt: Date | null;
  isDelivered: boolean;
  deliveredAt: Date | null;
  orderItems: OrderItem[];
  user: { name: string; email: string };
  paymentResult: PaymentResult;
};

export type OrderList = Omit<Order, "orderItems" | "paymentResult" | "user"> & {
  user: { name: string }; // در کوئری فقط نام کاربر گرفته شده
};

export type OrdersPaginatedData = {
  ordersList: OrderList[];
  totalPages: number;
};
