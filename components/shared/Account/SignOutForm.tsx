import { Button } from "@/components/ui/button";
import { userSignOut } from "@/lib/actions/auth.actions";
import { LogOut } from "lucide-react";

function SignOutForm() {
  return (
    <form className="" action={userSignOut}>
      <Button className="cursor-pointer" variant="ghost">
        <LogOut className="h-4 w-4 md:mr-2" />
        خروج از حساب
      </Button>
    </form>
  );
}

export default SignOutForm;
