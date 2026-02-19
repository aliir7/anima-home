"use client";

import { Button } from "@/components/ui/button";
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.actions";
import { formatError } from "@/lib/utils/formatError";
import { showErrorToast, showSuccessToast } from "@/lib/utils/showToastMessage";
import { Cart, CartItem } from "@/types";
import { Loader, Minus, Plus, ShoppingCart } from "lucide-react";
import { useTransition } from "react";

type CartActionsHandlerProps = {
  cart?: Cart;
  item: CartItem;
};

function CartActionsHandler({ cart, item }: CartActionsHandlerProps) {
  const [isPending, startTransition] = useTransition();

  //  Add to cart handler
  const handleAddToCart = async () => {
    startTransition(async () => {
      const res = await addItemToCart(item);

      if (res.success) {
        showSuccessToast(res.data, "top-left");
        return;
      }
      if (!res.success && res.error.type === "zod") {
        showErrorToast(formatError(res.error), "top-left");
        return;
      }
      if (!res.success && res.error.type === "custom") {
        showErrorToast(res.error.message, "top-left");
      }
      return;
    });
  };

  // Remove from cart handler
  const handleRemoveFromCart = async () => {
    startTransition(async () => {
      const res = await removeItemFromCart(item.productId);

      if (res.success) {
        showSuccessToast(res.data, "top-left");
        return;
      }
      if (!res.success && res.error.type === "zod") {
        showErrorToast(formatError(res.error), "top-left");
        return;
      }
      if (!res.success && res.error.type === "custom") {
        showErrorToast(res.error.message, "top-left");
      }
      return;
    });
  };

  // Check if item is in cart
  const existItem =
    cart && cart.items.find((p) => p.productId === item.productId);

  return existItem ? (
    <div>
      <Button type="button" variant="outline" onClick={handleRemoveFromCart}>
        {isPending ? (
          <Loader className="h-4 w-4 animate-spin" />
        ) : (
          <Minus className="h-4 w-4" />
        )}
      </Button>
      <span className="px-2">{existItem.qty}</span>
      <Button type="button" variant="outline" onClick={handleAddToCart}>
        {isPending ? (
          <Loader className="h-4 w-4 animate-spin" />
        ) : (
          <Plus className="h-4 w-4" />
        )}
      </Button>
    </div>
  ) : (
    <Button
      className="w-full gap-2 rounded-full"
      size="lg"
      type="button"
      onClick={handleAddToCart}
    >
      {isPending ? (
        <Loader className="h-4 w-4 animate-spin" />
      ) : (
        <Plus className="h-4 w-4" />
      )}
      <ShoppingCart className="h-5 w-5" />
      افزودن به سبد خرید
    </Button>
  );
}

export default CartActionsHandler;
