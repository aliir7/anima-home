import { Metadata } from "next";
import { redirect } from "next/navigation";

import AccountAddressForm from "@/components/shared/Account/AccountAddressForm";
import { getUserById } from "@/lib/actions/user.actions";
import { getCurrentSession } from "@/lib/auth/authGuard";
import { ShippingAddress } from "@/types";

export const metadata: Metadata = {
  title: "آدرس",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function AddressSettingsPage() {
  const session = await getCurrentSession();
  if (!session?.user) {
    redirect("/");
  }

  const user = await getUserById();

  return (
    <section className="space-y-6">
      <h2 className="text-primary text-xl font-semibold dark:text-neutral-100">
        آدرس
      </h2>

      <AccountAddressForm address={user.address as ShippingAddress | null} />
    </section>
  );
}

export default AddressSettingsPage;
