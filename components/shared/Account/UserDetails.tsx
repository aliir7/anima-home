// components/shared/Account/UserDetails.tsx
import { getUserById } from "@/lib/actions/user.actions";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

async function UserDetails() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const user = await getUserById(session.user.id);

  if (!user) {
    redirect("/");
  }

  return (
    <section
      id="profile"
      className="rounded-lg border bg-white p-4 dark:bg-neutral-900"
    >
      <h2 className="h3-bold text-primary mb-4 dark:text-neutral-100">
        اطلاعات حساب
      </h2>

      <div className="text-muted-foreground space-y-3 text-sm dark:text-neutral-300">
        <div className="flex justify-between">
          <span>نام</span>
          <span className="font-medium text-neutral-900 dark:text-neutral-100">
            {user.name ?? "—"}
          </span>
        </div>

        <div className="flex justify-between">
          <span>ایمیل</span>
          <span
            dir="ltr"
            className="font-medium text-neutral-900 dark:text-neutral-100"
          >
            {user.email}
          </span>
        </div>

        <div className="flex justify-between">
          <span>شماره موبایل</span>
          <span
            dir="ltr"
            className="font-medium text-neutral-900 dark:text-neutral-100"
          >
            {user.phone ?? "ثبت نشده"}
          </span>
        </div>

        <div className="flex justify-between">
          <span>وضعیت موبایل</span>
          <span
            className={
              user.phoneVerified ? "text-green-600" : "text-yellow-600"
            }
          >
            {user.phoneVerified ? "تأیید شده" : "تأیید نشده"}
          </span>
        </div>

        <div className="flex justify-between">
          <span>نقش</span>
          <span className="font-medium">
            {user.role === "admin" ? "مدیر" : "کاربر"}
          </span>
        </div>
      </div>
    </section>
  );
}

export default UserDetails;
