import { Metadata } from "next";

import UserDetails from "@/components/shared/Account/UserDetails";

export const metadata: Metadata = {
  title: "حساب کاربری",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

function MyAccountPage() {
  return <UserDetails />;
}

export default MyAccountPage;
