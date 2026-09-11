import { Metadata } from "next";
import { redirect } from "next/navigation";

import AvatarSettingsForm from "@/components/shared/Account/AvatarSettingsForm";
import { getUserById } from "@/lib/actions/user.actions";
import { getCurrentSession } from "@/lib/auth/authGuard";

export const metadata: Metadata = {
  title: "عکس پروفایل",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function AvatarSettingsPage() {
  const session = await getCurrentSession();
  if (!session?.user) {
    redirect("/");
  }

  const user = await getUserById();

  return (
    <section className="space-y-6">
      <h2 className="text-primary text-xl font-semibold dark:text-neutral-100">
        عکس پروفایل
      </h2>

      <AvatarSettingsForm name={user.name} image={user.image} />
    </section>
  );
}

export default AvatarSettingsPage;
