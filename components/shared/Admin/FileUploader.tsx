"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { uploadMedia, uploadMultipleMedia } from "@/lib/actions/media.actions";

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
  folderName = "media",
  multiple = false,
  onUploaded,
}: FileUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setProgress(0);

    const formData = new FormData();

    if (multiple) {
      for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
      }

      const urls = await uploadMultipleMedia(formData, folderName);
      setProgress(100);
      setUploading(false);
      setTimeout(() => setProgress(0), 500);
      onUploaded(urls);
    } else {
      formData.append("file", files[0]);
      const url = await uploadMedia(formData, folderName);
      setProgress(100);
      setUploading(false);
      setTimeout(() => setProgress(0), 500);
      if (url) onUploaded([url]);
    }
  };

  return (
    <div className="space-y-2">
      <Label className="block font-medium">{label}</Label>
      <Input
        type="file"
        accept={accept}
        onChange={handleUpload}
        multiple={multiple}
      />
      {uploading && (
        <div className="pt-1">
          <Progress
            value={progress}
            className="bg-primary dark:bg-neutral-700"
          />
          <p className="text-muted-foreground text-sm md:text-lg">
            {progress}%
          </p>
        </div>
      )}
    </div>
  );
}

export default FileUploader;
