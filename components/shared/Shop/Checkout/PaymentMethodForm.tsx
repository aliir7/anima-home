"use client";

import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

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
      const res = await updateUserPaymentMethod(values.type);

      if (!res.success) {
        showErrorToast(res.message!, "top-right");
      }

      showSuccessToast(res.message!, "top-right");
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
                        <FormLabel className="cursor-pointer font-normal">
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
              <Spinner className="h-4 w-4" />
            ) : (
              <ArrowLeft className="h-4 w-4" />
            )}
            <span className="mr-2">ادامه ثبت سفارش</span>
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default PaymentMethodForm;
