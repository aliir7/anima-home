import { Metadata } from "next";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
// import ForgotPasswordForm from "./ForgotPasswordForm";

export const metadata: Metadata = { title: "فراموشی رمز عبور" };

async function ForgotPasswordPage() {
  const session = await auth();

  // if user logged in redirect to homepage
  if (session) {
    redirect("/");
  }
  return (
    <div className="mx-auto my-12 w-full max-w-md px-4">
      <Card className="rounded-2xl border shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-xl font-semibold md:text-2xl">
            بازیابی رمز عبور
          </CardTitle>
        </CardHeader>
        <CardContent>{/* <ForgotPasswordForm /> */}</CardContent>
      </Card>
    </div>
  );
}

export default ForgotPasswordPage;
