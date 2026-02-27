"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useCartActions } from "@/hooks/useCartActions";
import { Cart, CartItem } from "@/types";
import { Minus, Plus, ShoppingCart } from "lucide-react";

type CartActionsHandlerProps = {
  cart?: Cart | null;
  item: CartItem;
};

function CartActionsHandler({ cart, item }: CartActionsHandlerProps) {
  // use cart actions hook
  const { optimisticCart, removeFromCart, addToCart } = useCartActions(
    cart?.items || [],
  );
  // Check if item is in cart
  const existItem = optimisticCart.find(
    (p) => p.productId === item.productId && p.variantId === item.variantId,
  );
  return existItem ? (
    <div>
      <Button
        type="button"
        variant="outline"
        onClick={() => removeFromCart(item.productId, item.variantId!)}
      >
        <Minus className="h-4 w-4" />
      </Button>
      <span className="px-2">{existItem.qty}</span>
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={() => addToCart(item)}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  ) : (
    <Button
      className="w-full gap-2 rounded-full"
      size="lg"
      type="button"
      onClick={() => addToCart(item)}
    >
      <ShoppingCart className="h-5 w-5" />
      افزودن به سبد خرید
    </Button>
  );
}

export default CartActionsHandler;
