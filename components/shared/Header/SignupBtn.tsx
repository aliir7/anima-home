import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { UserIcon } from "lucide-react";
import Link from "next/link";

async function SignupBtn() {
  const session = await auth();
  if (!session) {
    return (
      <div className="flex items-center">
        <Button
          asChild
          className="bg-secondary rounded-full text-neutral-900 hover:bg-neutral-300 hover:text-neutral-800 dark:text-white dark:hover:text-neutral-100"
        >
          <div>
            <UserIcon />
            <Link href="/sign-up" className="px-2 py-4">
              ثبت نام | ورود
            </Link>
          </div>
        </Button>
      </div>
    );
  } else {
    return <div>وارد شدید</div>;
  }
}

export default SignupBtn;
