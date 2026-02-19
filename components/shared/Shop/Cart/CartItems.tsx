// components/cart/CartItem.tsx
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";
import { CartItem } from "@/types";
import formatPrice from "@/lib/utils/formatPrice";

type CartItemsProps = {
  item: CartItem;
};

function CartItems({ item }: CartItemsProps) {
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
          <p className="text-muted-foreground mt-1 text-xs">
            قیمت واحد: {formatPrice(item.price)}
          </p>
        </div>

        <div className="flex items-center justify-between">
          {/* Qty */}
          <div className="flex items-center gap-2">
            <Button size="icon" variant="outline">
              <Plus className="h-4 w-4" />
            </Button>

            <span className="w-6 text-center text-sm">{item.qty}</span>

            <Button size="icon" variant="outline">
              <Minus className="h-4 w-4" />
            </Button>
          </div>

          {/* Total */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold">
              {formatPrice(item.price * item.qty)}
            </span>

            <Button size="icon" variant="ghost">
              <Trash2 className="text-destructive h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartItems;
