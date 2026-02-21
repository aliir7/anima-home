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
import { showErrorToast } from "@/lib/utils/showToastMessage";
import { shippingAddressSchema } from "@/lib/validations/orderValidations";
import { ShippingAddress } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";

type ShippingAddressFormProps = {
  address: ShippingAddress;
};

function ShippingAddressForm({ address }: ShippingAddressFormProps) {
  const router = useRouter();
  const form = useForm<ShippingAddress>({
    resolver: zodResolver(shippingAddressSchema),
    defaultValues: address || shippingAddressDefaultValues,
    mode: "onTouched",
  });
  // submit address handler
  const onSubmit: SubmitHandler<ShippingAddress> = async (values) => {
    const res = await updateUserAddress(values);

    if (!res.success) {
      showErrorToast(res.message!, "top-right");
      return;
    }
    router.push("/shop/checkout/");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mx-auto max-w-md">
        <Card>
          <CardContent className="space-y-4 p-4">
            <h2 className="text-sm font-semibold">اطلاعات گیرنده</h2>

            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>نام و نام خانوادگی</FormLabel>
                  <FormControl>
                    <Input placeholder="نام و نام خانوادگی" {...field} />
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
                    <Input placeholder="شماره موبایل" {...field} />
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
                    <Input placeholder="کد پستی" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>آدرس کامل</FormLabel>
                  <FormControl>
                    <Textarea rows={4} placeholder="آدرس کامل" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              className="w-full cursor-pointer rounded-full disabled:cursor-none"
              size="lg"
              type="submit"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "در حال ثبت آدرس" : "ادامه"}
            </Button>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}

export default ShippingAddressForm;
