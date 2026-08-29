import { Metadata } from "next";
import { getUserById } from "@/lib/actions/user.actions";
import { getCurrentSession } from "@/lib/auth/authGuard";
import { redirect } from "next/navigation";
import CheckoutSteps from "@/components/shared/Shop/Checkout/CheckoutSteps";
import { ShippingAddress } from "@/types";
import ShippingAddressForm from "@/components/shared/Shop/Checkout/ShippingAddressForm";

export const metadata: Metadata = {
  title: "آدرس ارسال سفارش",
};

async function CheckoutPage() {
  const session = await getCurrentSession();
  const userId = session?.user?.id;

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await getUserById();

  return (
    <section className="wrapper">
      <CheckoutSteps current={1} />
      <ShippingAddressForm address={user.address as ShippingAddress} />
    </section>
  );
}

export default CheckoutPage;
