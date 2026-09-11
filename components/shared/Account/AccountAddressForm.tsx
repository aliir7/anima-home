"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

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
import { Textarea } from "@/components/ui/textarea";
import { updateUserAddress } from "@/lib/actions/user.actions";
import { shippingAddressDefaultValues } from "@/lib/constants";
import { showErrorToast, showSuccessToast } from "@/lib/utils/showToastMessage";
import { shippingAddressSchema } from "@/lib/validations/orderValidations";
import { ShippingAddress } from "@/types";

type AccountAddressFormProps = {
  address: ShippingAddress | null;
};

function AccountAddressForm({ address }: AccountAddressFormProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<ShippingAddress>({
    resolver: zodResolver(shippingAddressSchema),
    defaultValues: address || shippingAddressDefaultValues,
    mode: "onTouched",
  });

  const onSubmit: SubmitHandler<ShippingAddress> = (values) => {
    startTransition(async () => {
      const res = await updateUserAddress(values);

      if (!res.success) {
        showErrorToast(res.message || "خطایی رخ داد", "top-right");
        return;
      }

      showSuccessToast(res.message || "آدرس با موفقیت ثبت شد", "bottom-right");
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardContent className="space-y-5 px-6 py-4">
            <h3 className="text-sm font-semibold">آدرس ارسال</h3>

            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>نام و نام خانوادگی</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="مثال: علی رضایی"
                      {...field}
                      className="outline-light dark:outline-dark rounded-full placeholder:md:text-sm"
                    />
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
                  <FormLabel>شماره موبایل</FormLabel>
                  <FormControl>
                    <Input
                      className="outline-light dark:outline-dark rounded-full text-right placeholder:md:text-sm"
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
                      <Input
                        placeholder="مثال: تهران"
                        {...field}
                        className="outline-light dark:outline-dark rounded-full text-right placeholder:md:text-sm"
                      />
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
                        className="outline-light dark:outline-dark rounded-full text-right placeholder:md:text-sm"
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
              name="streetAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>آدرس دقیق پستی</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={3}
                      placeholder="خیابان اصلی، خیابان فرعی، کوچه، پلاک، واحد"
                      {...field}
                      className="outline-light dark:outline-dark text-right placeholder:md:text-sm"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              className="mt-2 w-full cursor-pointer rounded-full disabled:cursor-none md:w-auto"
              type="submit"
              disabled={isPending}
            >
              {isPending ? "در حال ثبت..." : "ذخیره آدرس"}
            </Button>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}

export default AccountAddressForm;
