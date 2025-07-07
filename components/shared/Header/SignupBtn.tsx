import { Button } from "@/components/ui/button";
import { UserIcon } from "lucide-react";
import Link from "next/link";

function SignupBtn() {
  return (
    <div className="flex items-center">
      <Button
        asChild
        className="bg-secondary rounded-full text-neutral-900 hover:bg-neutral-300 hover:text-neutral-800 active:bg-neutral-300 active:text-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-300 dark:active:bg-neutral-300"
      >
        <div>
          <UserIcon />
          <Link href="/sign-in" className="px-2 py-4">
            ثبت نام | ورود
          </Link>
        </div>
      </Button>
    </div>
  );
}

export default SignupBtn;
