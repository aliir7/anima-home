"use Client";

import { Cart, CartItem } from "@/types";
import { useRouter } from "next/navigation";

type AddToCartProps = {
  cart?: Cart;
  item: CartItem;
};

function AddToCart({ cart, item }: AddToCartProps) {
  const router = useRouter();

  return <div>AddToCart</div>;
}

export default AddToCart;
