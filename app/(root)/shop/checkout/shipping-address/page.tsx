import { Metadata } from "next";
import { getUserById } from "@/lib/actions/user.actions";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import CheckoutSteps from "@/components/shared/Shop/Checkout/CheckoutSteps";
import { ShippingAddress } from "@/types";
import ShippingAddressForm from "@/components/shared/Shop/Checkout/ShippingAddressForm";

export const metadata: Metadata = {
  title: "آدرس ارسال سفارش",
};

async function CheckoutPage() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await getUserById(userId);

  return (
    <section className="wrapper">
      <CheckoutSteps current={1} />
      <ShippingAddressForm address={user.address as ShippingAddress} />
    </section>
  );
}

export default CheckoutPage;
