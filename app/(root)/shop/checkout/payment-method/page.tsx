import { Metadata } from "next";
import { getUserById } from "@/lib/actions/user.actions";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import CheckoutSteps from "@/components/shared/Shop/Checkout/CheckoutSteps";
import PaymentMethodForm from "@/components/shared/Shop/Checkout/PaymentMethodForm";

export const metadata: Metadata = {
  title: "روش پرداخت",
};

async function PaymentMethodPage() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await getUserById(userId);

  return (
    <section className="wrapper">
      <CheckoutSteps current={2} />
      <PaymentMethodForm preferredPaymentMethod={user.paymentMethod!} />
    </section>
  );
}

export default PaymentMethodPage;
