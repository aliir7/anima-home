"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

type FileUploaderProps = {
  label: string;
  accept: string;
  multiple?: boolean;
  folderName: string;
  onUploaded: (files: { url: string; key: string }[]) => void;
};

function FileUploader({
  label,
  accept,
  multiple = false,
  folderName,
  onUploaded,
}: FileUploaderProps) {
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const xhr = new XMLHttpRequest();
    const formData = new FormData();

    Array.from(files).forEach((file) => formData.append("files", file));
    formData.append("folder", folderName);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded * 100) / event.total);
        setProgress(percent);
      }
    };

    xhr.onload = () => {
      setIsUploading(false);
      if (xhr.status === 200) {
        const res = JSON.parse(xhr.responseText);
        onUploaded(res.files);
      } else {
        console.error("Upload failed", xhr.responseText);
      }
    };

    xhr.onerror = () => {
      console.error("Upload error");
      setIsUploading(false);
    };

    xhr.open("POST", "/api/storage/upload");
    setIsUploading(true);
    xhr.send(formData);
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleUpload}
        disabled={isUploading}
      />
      {isUploading && <Progress value={progress} />}
    </div>
  );
}

export default FileUploader;
