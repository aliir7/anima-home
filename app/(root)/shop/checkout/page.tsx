import { Metadata } from "next";
import { getUserById } from "@/lib/actions/user.actions";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import CheckoutSteps from "@/components/shared/Shop/Checkout/CheckoutSteps";

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
    <>
      <CheckoutSteps current={1} />
      <AddressForm user={user} />
    </>
  );
}

export default CheckoutPage;
