"use client";

import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { updateSiteSettings } from "@/lib/actions/settings.actions";
import {
  showErrorToast,
  showSuccessToast,
} from "@/lib/utils/showToastMessage";

type SettingsFormValues = {
  phonePrimary: string;
  phoneSecondary: string;
  email: string;
  address: string;
  instagramUrl: string;
  telegramUrl: string;
  whatsappUrl: string;
  youtubeUrl: string;
  aparatUrl: string;
  bleUrl: string;
};

type SettingsFormProps = {
  initialValues: {
    phonePrimary: string | null;
    phoneSecondary: string | null;
    email: string | null;
    address: string | null;
    instagramUrl: string | null;
    telegramUrl: string | null;
    whatsappUrl: string | null;
    youtubeUrl: string | null;
    aparatUrl: string | null;
    bleUrl: string | null;
  };
};

export default function SettingsForm({ initialValues }: SettingsFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SettingsFormValues>({
    defaultValues: {
      phonePrimary: initialValues.phonePrimary ?? "",
      phoneSecondary: initialValues.phoneSecondary ?? "",
      email: initialValues.email ?? "",
      address: initialValues.address ?? "",
      instagramUrl: initialValues.instagramUrl ?? "",
      telegramUrl: initialValues.telegramUrl ?? "",
      whatsappUrl: initialValues.whatsappUrl ?? "",
      youtubeUrl: initialValues.youtubeUrl ?? "",
      aparatUrl: initialValues.aparatUrl ?? "",
      bleUrl: initialValues.bleUrl ?? "",
    },
  });

  const onSubmit = async (data: SettingsFormValues) => {
    const res = await updateSiteSettings(data);

    if (!res.success) {
      const message =
        res.error.type === "custom"
          ? res.error.message
          : "ورودی نامعتبر است، دوباره بررسی کنید";
      showErrorToast(message, "top-right");
      return;
    }

    showSuccessToast(res.data ?? "با موفقیت ذخیره شد", "top-right");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>اطلاعات تماس</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="phonePrimary">شماره تماس اول</Label>
            <Input id="phonePrimary" dir="ltr" {...register("phonePrimary")} />
            {errors.phonePrimary && (
              <p className="text-destructive text-xs">
                {errors.phonePrimary.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="phoneSecondary">شماره تماس دوم</Label>
            <Input
              id="phoneSecondary"
              dir="ltr"
              {...register("phoneSecondary")}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email">ایمیل</Label>
            <Input id="email" dir="ltr" {...register("email")} />
            {errors.email && (
              <p className="text-destructive text-xs">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="address">آدرس (اختیاری)</Label>
            <Input id="address" {...register("address")} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>شبکه‌های اجتماعی</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="instagramUrl">اینستاگرام</Label>
            <Input id="instagramUrl" dir="ltr" {...register("instagramUrl")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="telegramUrl">تلگرام</Label>
            <Input id="telegramUrl" dir="ltr" {...register("telegramUrl")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="whatsappUrl">واتساپ</Label>
            <Input id="whatsappUrl" dir="ltr" {...register("whatsappUrl")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="youtubeUrl">یوتیوب</Label>
            <Input id="youtubeUrl" dir="ltr" {...register("youtubeUrl")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="aparatUrl">آپارات</Label>
            <Input id="aparatUrl" dir="ltr" {...register("aparatUrl")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="bleUrl">بله</Label>
            <Input id="bleUrl" dir="ltr" {...register("bleUrl")} />
          </div>
        </CardContent>
      </Card>

      <Button type="submit" disabled={isSubmitting} className="rounded-full px-6">
        {isSubmitting ? "در حال ذخیره..." : "ذخیره‌ی تنظیمات"}
      </Button>
    </form>
  );
}
