"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  uploadSingleFile,
  multipleUploadClient,
} from "@/lib/utils/clientUpload"; // مسیر درست
import { showErrorToast } from "@/lib/utils/showToastMessage";

type FileUploaderProps = {
  label: string;
  accept: string;
  multiple?: boolean;
  folderName?: string;
  onUploaded: (urls: string[]) => void;
};

function FileUploader({
  label,
  accept,
  multiple = false,
  folderName = "media",
  onUploaded,
}: FileUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setProgress(10);

    try {
      if (multiple) {
        const urls = await multipleUploadClient(Array.from(files), folderName);
        onUploaded(urls);
      } else {
        const url = await uploadSingleFile(files[0], folderName);
        onUploaded([url]);
      }
      setProgress(100);
    } catch (err) {
      console.error(err);
      showErrorToast("خطا در آپلود فایل", "top-right");
    } finally {
      setUploading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  return (
    <div className="space-y-2">
      <Label className="font-medium">{label}</Label>
      <Input
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleUpload}
      />
      {uploading && (
        <div className="space-y-1">
          <Progress value={progress} />
          <div className="text-muted-foreground text-center text-sm">
            {progress}%
          </div>
        </div>
      )}
    </div>
  );
}

export default FileUploader;
