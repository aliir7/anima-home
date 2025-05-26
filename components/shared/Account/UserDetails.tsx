function UserDetails() {
  return (
    <section id="profile">
      <h2 className="h3-bold text-primary mx-4 mt-4 mb-4 dark:text-neutral-900">
        اطلاعات حساب
      </h2>
      <div className="text-muted-foreground mx-4 space-y-2 dark:text-neutral-800">
        <p>نام: علی رضایی</p>
        <p>ایمیل: ali@example.com</p>
        {/* در آینده فرم ویرایش هم اضافه می‌شه */}
      </div>
    </section>
  );
}

export default UserDetails;
