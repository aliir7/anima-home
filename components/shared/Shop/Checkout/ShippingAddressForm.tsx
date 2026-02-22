"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { updateUserAddress } from "@/lib/actions/user.actions";
import { shippingAddressDefaultValues } from "@/lib/constants";
import { showErrorToast, showSuccessToast } from "@/lib/utils/showToastMessage";
import { shippingAddressSchema } from "@/lib/validations/orderValidations";
import { ShippingAddress } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

type ShippingAddressFormProps = {
  address: ShippingAddress;
};

function ShippingAddressForm({ address }: ShippingAddressFormProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<ShippingAddress>({
    resolver: zodResolver(shippingAddressSchema),
    defaultValues: address || shippingAddressDefaultValues,
    mode: "onTouched",
  });

  const onSubmit: SubmitHandler<ShippingAddress> = async (values) => {
    startTransition(async () => {
      try {
        const res = await updateUserAddress(values);

        if (!res.success) {
          showErrorToast(res.message || "خطایی رخ داد", "top-right");
          return;
        }

        showSuccessToast(
          res.message || "آدرس با موفقیت ثبت شد",
          "bottom-right",
        );
        router.push("/shop/checkout/payment-method");
      } catch (error) {
        showErrorToast("خطای ارتباط با سرور", "top-right");
      }
    });
  };

  return (
    <Form {...form}>
      {/* 
        در صورت بروز خطا در اعتبارسنجی Zod، لاگ آن در کنسول چاپ می‌شود
      */}
      <form
        onSubmit={form.handleSubmit(onSubmit, (err) =>
          console.log("Zod Error: ", err),
        )}
        className="mx-auto max-w-md"
      >
        <Card>
          <CardContent className="space-y-4 p-4">
            <h2 className="mb-4 text-sm font-semibold">
              اطلاعات گیرنده و آدرس ارسال
            </h2>

            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>نام و نام خانوادگی گیرنده</FormLabel>
                  <FormControl>
                    <Input placeholder="مثال: علی رضایی" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>شماره موبایل گیرنده</FormLabel>
                  <FormControl>
                    {/* dir="ltr" برای تایپ راحت و text-right برای تراز شدن با راست قرار داده شده */}
                    <Input
                      className="text-right"
                      dir="ltr"
                      placeholder="09123456789"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>شهر</FormLabel>
                    <FormControl>
                      <Input placeholder="مثال: تهران" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="postalCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>کد پستی</FormLabel>
                    <FormControl>
                      <Input
                        className="text-right"
                        dir="ltr"
                        placeholder="1234567890"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="streetAddress" // نام دقیق در اسکیمای شما
              render={({ field }) => (
                <FormItem>
                  <FormLabel>آدرس دقیق پستی</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={3}
                      placeholder="خیابان اصلی، خیابان فرعی، کوچه، پلاک، واحد"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              className="mt-6 w-full"
              size="lg"
              type="submit"
              disabled={isPending}
            >
              {isPending ? "در حال ثبت..." : "ادامه و انتخاب روش پرداخت"}
            </Button>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}

export default ShippingAddressForm;
