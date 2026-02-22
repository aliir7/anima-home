"use client";

import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  DEFAULT_PAYMENT_METHOD,
  PAYMENT_METHOD_LABEL,
  PAYMENT_METHODS,
} from "@/lib/constants";
import { paymentMethodSchema } from "@/lib/validations/orderValidations";
import { Button } from "@/components/ui/button";
import { RadioGroupItem, RadioGroup } from "@/components/ui/radio-group";
import { Spinner } from "@/components/ui/spinner";
import { useTransition } from "react";
import { PaymentMethod, PaymentMethodFormValues } from "@/types";
import { ArrowLeft } from "lucide-react";
import { updateUserPaymentMethod } from "@/lib/actions/user.actions";
import { showErrorToast, showSuccessToast } from "@/lib/utils/showToastMessage";

type PaymentMethodFormProps = {
  preferredPaymentMethod: PaymentMethod | null;
};

function PaymentMethodForm({ preferredPaymentMethod }: PaymentMethodFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm({
    resolver: zodResolver(paymentMethodSchema),
    mode: "onChange",
    defaultValues: {
      type: preferredPaymentMethod || DEFAULT_PAYMENT_METHOD,
    },
  });

  // payment method handler
  const onSubmit = async (values: PaymentMethodFormValues) => {
    startTransition(async () => {
      // ✅ اصلاح اول: کل values که یک آبجکت هست رو می‌فرستیم، نه فقط values.type رو
      const res = await updateUserPaymentMethod(values);

      if (!res.success) {
        showErrorToast(res.message || "خطایی رخ داد", "top-right");
        return; // ✅ اصلاح دوم: حتماً باید return کنیم تا کدهای پایین‌تر اجرا نشن
      }

      showSuccessToast(res.message || "روش پرداخت ثبت شد", "bottom-right");
      router.push("/shop/checkout/place-order");
    });
  };

  return (
    <div className="mx-auto max-w-md space-y-4">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold">روش پرداخت</h2>
        <p className="text-muted-foreground text-sm">
          لطفاً روش پرداخت سفارش خود را انتخاب کنید
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    className="space-y-3"
                  >
                    {PAYMENT_METHODS.map((method) => (
                      <FormItem
                        key={method}
                        className="hover:bg-muted/50 flex items-center gap-3 rounded-lg border p-3 transition"
                      >
                        <FormControl>
                          <RadioGroupItem
                            value={method}
                            checked={field.value === method}
                          />
                        </FormControl>
                        {/* 
                            نکته: در Tailwind وقتی dir سایت rtl هست، ml-0 و gap خودش فاصله رو درست می‌کنه 
                        */}
                        <FormLabel className="mt-0 cursor-pointer font-normal">
                          {PAYMENT_METHOD_LABEL[method]}
                        </FormLabel>
                      </FormItem>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? (
              <Spinner className="ml-2 h-4 w-4" />
            ) : (
              <ArrowLeft className="ml-2 h-4 w-4" />
            )}
            <span>ادامه ثبت سفارش</span>
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default PaymentMethodForm;
