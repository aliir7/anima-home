"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ContactFormValues } from "@/types";
import { contactFormSchema } from "@/lib/validations/usersValidations";
import { submitContactForm } from "@/lib/actions/user.actions";
import { showErrorToast, showSuccessToast } from "@/lib/utils/showToastMessage";

export default function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,

    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    mode: "onTouched",
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (formData: ContactFormValues) => {
    const result = await submitContactForm(formData);

    if (result.success) {
      showSuccessToast("پیام شما با موفقیت ارسال شد", "top-right");
      reset();
    }
    if (!result.success && result.error.type === "custom") {
      showErrorToast(result.error.message, "top-right");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-4 space-y-4 text-right sm:text-sm"
    >
      <div className="grid gap-4 md:grid-cols-2 dark:text-neutral-400">
        <div className="space-y-1">
          <Input
            {...register("name")}
            placeholder="نام شما"
            className="outline-light dark:outline-dark rounded-full text-right dark:border-neutral-600"
          />
          {errors.name && (
            <p className="pr-2 text-xs text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <Input
            {...register("email")}
            type="email"
            placeholder="ایمیل شما"
            className="outline-light dark:outline-dark rounded-full text-right dark:border-neutral-600"
          />
          {errors.email && (
            <p className="pr-2 text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-1">
        <Input
          {...register("subject")}
          placeholder="موضوع پیام"
          className="outline-light dark:outline-dark rounded-full text-right dark:border-neutral-600"
        />
        {/* موضوع اختیاری است اما اگر ارور خاصی تعریف کردید اینجا نمایش دهید */}
      </div>

      <div className="space-y-1">
        <Textarea
          {...register("message")}
          placeholder="متن پیام..."
          className="outline-light dark:outline-dark min-h-30 text-right dark:border-neutral-600"
        />
        {errors.message && (
          <p className="pr-2 text-xs text-red-500">{errors.message.message}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="outline-light dark:outline-dark mt-2 w-full cursor-pointer rounded-full px-4 py-2 hover:text-neutral-200 active:text-neutral-200 disabled:opacity-50 sm:mt-4 md:w-auto dark:hover:text-neutral-700 dark:active:text-neutral-700"
      >
        {isSubmitting ? "در حال ارسال..." : "ارسال پیام"}
      </Button>
    </form>
  );
}
