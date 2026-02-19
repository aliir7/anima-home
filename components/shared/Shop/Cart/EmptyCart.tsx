import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";

function EmptyCart() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <ShoppingCart className="text-muted-foreground h-16 w-16" />
      <h2 className="text-lg font-semibold">سبد خرید شما خالی است</h2>
      <p className="text-muted-foreground text-sm">
        برای مشاهده محصولات به فروشگاه برگردید
      </p>
      <Button
        asChild
        className="cursor-pointer rounded-full px-6 py-4 transition"
      >
        <Link href="/shop">بازگشت به فروشگاه</Link>
      </Button>
    </div>
  );
}

export default EmptyCart;
