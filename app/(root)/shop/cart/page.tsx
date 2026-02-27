import CartClientWrapper from "@/components/shared/Shop/Cart/CartClientWrapper";
import CartItems from "@/components/shared/Shop/Cart/CartItems";
import CartSummary from "@/components/shared/Shop/Cart/CartSummary";
import EmptyCart from "@/components/shared/Shop/Cart/EmptyCart";
import { getMyCart } from "@/lib/actions/cart.actions";
import { Cart } from "@/types";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "سبد خرید",
};

export const revalidate = 0;

export default async function CartPage() {
  const cart = (await getMyCart()) as Cart;

  if (!cart || cart.items.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="wrapper px-4 py-6">
      <h2 className="text-primary mb-6 text-xl font-bold dark:text-neutral-950">
        سبد خرید
      </h2>

      <CartClientWrapper initialCart={cart} />
    </div>
  );
}
