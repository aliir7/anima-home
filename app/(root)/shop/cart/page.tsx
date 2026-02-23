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
      <h2 className="mb-6 text-xl font-bold">سبد خرید</h2>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Cart Items */}
        <div className="space-y-4 lg:col-span-8">
          {cart.items.map((item, index) => (
            <CartItems key={index} item={item} />
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-4">
          <CartSummary cart={cart} />
        </div>
      </div>
    </div>
  );
}
