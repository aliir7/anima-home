"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import FileUploader from "@/components/shared/FileUploader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  removeAvatarAction,
  updateAvatarAction,
} from "@/lib/actions/account.actions";
import { showErrorToast, showSuccessToast } from "@/lib/utils/showToastMessage";
import { getStorageUrl } from "@/lib/utils/urlUtils";

type AvatarSettingsFormProps = {
  name: string | null;
  image: string | null;
};

function AvatarSettingsForm({ name, image }: AvatarSettingsFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isRemoving, startRemoveTransition] = useTransition();
  // این state همیشه مقدار خام ذخیره‌شده در دیتابیس را نگه می‌دارد (کلید
  // نسبی مثل avatars/xxx.jpg) — برای نمایش، هر بار از getStorageUrl رد
  // می‌شود تا آدرس کامل قابل‌نمایش ساخته شود.
  const [rawImage, setRawImage] = useState<string | null>(image);
  const displaySrc = rawImage ? getStorageUrl(rawImage) : "";

  const handleUploaded = (files: { url: string; key: string }[]) => {
    const uploaded = files[0];
    if (!uploaded) return;

    startTransition(async () => {
      // فقط کلید نسبی (avatars/xxx.jpg) در دیتابیس ذخیره می‌شود، نه URL
      // کامل — نمایش آن هر جا لازم شد با getStorageUrl ساخته می‌شود.
      const result = await updateAvatarAction(uploaded.key);

      if (!result.success) {
        const message =
          result.error.type === "custom"
            ? result.error.message
            : "به‌روزرسانی عکس پروفایل انجام نشد";
        showErrorToast(message, "top-right");
        return;
      }

      setRawImage(uploaded.key);
      showSuccessToast(result.data ?? "عکس پروفایل به‌روزرسانی شد", "top-right");
      router.refresh();
    });
  };

  const handleRemove = () => {
    startRemoveTransition(async () => {
      const result = await removeAvatarAction();

      if (!result.success) {
        const message =
          result.error.type === "custom"
            ? result.error.message
            : "حذف عکس پروفایل انجام نشد";
        showErrorToast(message, "top-right");
        return;
      }

      setRawImage(null);
      showSuccessToast(result.data ?? "عکس پروفایل حذف شد", "top-right");
      router.refresh();
    });
  };

  return (
    <Card>
      <CardContent className="space-y-6 px-6 py-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={displaySrc} alt={name || "کاربر"} />
            <AvatarFallback className="text-primary dark:text-primaryDark text-2xl">
              {name?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>

          {rawImage && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleRemove}
              disabled={isRemoving}
              className="cursor-pointer rounded-full"
            >
              {isRemoving ? "در حال حذف..." : "حذف عکس پروفایل"}
            </Button>
          )}
        </div>

        <FileUploader
          label="آپلود عکس پروفایل جدید"
          accept="image/*"
          multiple={false}
          folderName="avatars"
          onUploaded={handleUploaded}
        />

        {isPending && (
          <p className="text-muted-foreground text-xs">
            در حال ذخیره تغییرات...
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export default AvatarSettingsForm;
