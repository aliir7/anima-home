import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Activity } from "react";

function CartBtn({ cartItemsNumber }: { cartItemsNumber: number }) {
  return (
    <div className="relative">
      <Button
        asChild
        size="icon"
        variant="ghost"
        className="relative bg-transparent transition-all"
      >
        <Link href="/shop/cart">
          <ShoppingBag className="h-6 w-6" />

          {/* Badge */}
          <Activity mode={cartItemsNumber > 0 ? "visible" : "hidden"}>
            <Badge className="absolute -top-1.5 -right-1.5 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-xs leading-none">
              {cartItemsNumber}
            </Badge>
          </Activity>
        </Link>
      </Button>
    </div>
  );
}

export default CartBtn;
