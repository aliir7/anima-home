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

type AvatarSettingsFormProps = {
  name: string | null;
  image: string | null;
};

function AvatarSettingsForm({ name, image }: AvatarSettingsFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isRemoving, startRemoveTransition] = useTransition();
  const [previewImage, setPreviewImage] = useState<string | null>(image);

  const handleUploaded = (files: { url: string; key: string }[]) => {
    const uploaded = files[0];
    if (!uploaded) return;

    startTransition(async () => {
      const result = await updateAvatarAction(uploaded.url);

      if (!result.success) {
        const message =
          result.error.type === "custom"
            ? result.error.message
            : "به‌روزرسانی عکس پروفایل انجام نشد";
        showErrorToast(message, "top-right");
        return;
      }

      setPreviewImage(uploaded.url);
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

      setPreviewImage(null);
      showSuccessToast(result.data ?? "عکس پروفایل حذف شد", "top-right");
      router.refresh();
    });
  };

  return (
    <Card>
      <CardContent className="space-y-6 px-6 py-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={previewImage || ""} alt={name || "کاربر"} />
            <AvatarFallback className="text-primary dark:text-primaryDark text-2xl">
              {name?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>

          {previewImage && (
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
