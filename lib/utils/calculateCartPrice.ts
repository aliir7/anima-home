import { CartItem } from "@/types";

export function calculateCartPrice(items: CartItem[]) {
  const itemsPrice = items.reduce(
    (acc, item) => acc + Number(item.price) * item.qty,
    0,
  );

  const taxPrice = 0 * itemsPrice;
  const totalPrice = itemsPrice + taxPrice;

  return {
    itemsPrice,
    taxPrice,
    totalPrice,
  };
}
