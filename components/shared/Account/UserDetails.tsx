import { auth } from "@/lib/auth";

async function UserDetails() {
  const session = await auth();
  const username = session?.user.name || "name";
  const email = session?.user.email || "email@example.com";
  return (
    <section id="profile">
      <h2 className="h3-bold text-primary mx-4 mt-4 mb-4 dark:text-neutral-900">
        اطلاعات حساب
      </h2>
      <div className="text-muted-foreground mx-4 space-y-2 dark:text-neutral-800">
        <p>نام: {username}</p>
        <p>ایمیل: {email}</p>
        {/* در آینده فرم ویرایش هم اضافه می‌شه */}
      </div>
    </section>
  );
}

export default UserDetails;
