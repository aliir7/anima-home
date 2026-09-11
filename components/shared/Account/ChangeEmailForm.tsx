"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm } from "react-hook-form";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  changeEmailAction,
  resendEmailVerificationAction,
} from "@/lib/actions/account.actions";
import { showErrorToast, showSuccessToast } from "@/lib/utils/showToastMessage";
import { changeEmailSchema } from "@/lib/validations/usersValidations";
import { ChangeEmailValues } from "@/types";

type ChangeEmailFormProps = {
  currentEmail: string | null;
  emailVerified: boolean;
};

function ChangeEmailForm({ currentEmail, emailVerified }: ChangeEmailFormProps) {
  const [isPending, startTransition] = useTransition();
  const [isResending, startResendTransition] = useTransition();

  const form = useForm<ChangeEmailValues>({
    resolver: zodResolver(changeEmailSchema),
    mode: "onTouched",
    defaultValues: { newEmail: "" },
  });

  const onSubmit = (values: ChangeEmailValues) => {
    startTransition(async () => {
      const result = await changeEmailAction(values.newEmail);

      if (!result.success) {
        const message =
          result.error.type === "custom"
            ? result.error.message
            : "ایمیل وارد شده معتبر نیست";
        showErrorToast(message, "top-right");
        return;
      }

      showSuccessToast(result.data ?? "درخواست تغییر ایمیل ثبت شد", "top-right");
      form.reset();
    });
  };

  const onResend = () => {
    startResendTransition(async () => {
      const result = await resendEmailVerificationAction();

      if (!result.success) {
        const message =
          result.error.type === "custom"
            ? result.error.message
            : "ارسال ایمیل تایید انجام نشد";
        showErrorToast(message, "top-right");
        return;
      }

      showSuccessToast(result.data ?? "ایمیل تایید ارسال شد", "top-right");
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="space-y-4 px-6 py-4">
          <h3 className="text-sm font-semibold">وضعیت ایمیل</h3>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-muted-foreground text-xs">ایمیل فعلی</p>
              <p dir="ltr" className="truncate text-sm font-medium">
                {currentEmail ?? "ثبت نشده"}
              </p>
            </div>

            {emailVerified ? (
              <Badge className="border-transparent bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400">
                تایید شده
              </Badge>
            ) : (
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="border-transparent bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400">
                  تایید نشده
                </Badge>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={onResend}
                  disabled={isResending}
                  className="cursor-pointer rounded-full"
                >
                  {isResending ? "در حال ارسال..." : "ارسال دوباره ایمیل تایید"}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-4 px-6 py-4">
          <h3 className="text-sm font-semibold">تغییر ایمیل</h3>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="newEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ایمیل جدید</FormLabel>
                    <FormControl>
                      <Input
                        dir="ltr"
                        type="email"
                        placeholder="example@email.com"
                        className="outline-light dark:outline-dark rounded-full text-right placeholder:md:text-sm"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <p className="text-muted-foreground text-xs">
                بعد از ثبت، ابتدا لینک تایید به ایمیل فعلی شما ارسال می‌شود؛
                پس از تایید آن، یک لینک تایید دیگر برای ایمیل جدید ارسال
                خواهد شد و ایمیل فقط پس از تایید هر دو تغییر می‌کند.
              </p>

              <Button
                type="submit"
                disabled={isPending}
                className="cursor-pointer rounded-full"
              >
                {isPending ? "در حال ثبت..." : "ثبت درخواست تغییر ایمیل"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

export default ChangeEmailForm;
