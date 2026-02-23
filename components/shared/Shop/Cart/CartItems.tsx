"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Cart, CartItem } from "@/types";
import formatPrice from "@/lib/utils/formatPrice";
import { useCartActions } from "@/hooks/useCartActions";
import { Spinner } from "@/components/ui/spinner";

type CartItemsProps = {
  item: CartItem;
  cart?: Cart;
};

function CartItems({ item, cart }: CartItemsProps) {
  // Check if item is in cart
  const existItem =
    cart && cart.items.find((p) => p.productId === item.productId);

  const { addToCart, removeFromCart, isAdding, isRemoving } = useCartActions();

  return (
    <div className="flex gap-4 rounded-lg border bg-white p-4">
      {/* Image */}
      <div className="relative h-24 w-24 shrink-0">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="rounded object-cover"
        />
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col justify-between">
        <div>
          <h3 className="text-sm font-medium">{item.name}</h3>
          <p className="text-muted-foreground mt-2 text-xs dark:text-neutral-500">
            قیمت واحد: {formatPrice(item.price)}
          </p>
        </div>

        <div className="flex items-center justify-between">
          {/* Qty */}
          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="outline"
              disabled={isAdding}
              onClick={() => addToCart(item)}
              className="cursor-pointer disabled:cursor-none dark:border dark:border-neutral-300 dark:text-neutral-900 dark:hover:bg-neutral-100"
            >
              {isAdding ? (
                <Spinner className="h-4 w-4" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
            </Button>

            <span className="w-6 text-center text-sm">{item.qty}</span>

            <Button
              size="icon"
              variant="outline"
              disabled={isRemoving}
              className="cursor-pointer disabled:cursor-none dark:border dark:border-neutral-300 dark:text-neutral-900 dark:hover:bg-neutral-100"
              onClick={() => removeFromCart(item.productId)}
            >
              {isRemoving ? (
                <Spinner className="h-4 w-4" />
              ) : (
                <Minus className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Total */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold">
              {formatPrice(item.price * item.qty)}
            </span>

            <Button
              size="icon"
              variant="outline"
              className="cursor-pointer dark:border dark:border-neutral-300 dark:text-neutral-900 dark:hover:bg-neutral-100"
              onClick={() => removeFromCart(item.productId, true)}
            >
              {isRemoving ? (
                <Spinner className="h-4 w-4" />
              ) : (
                <Trash2 className="text-destructive h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartItems;
