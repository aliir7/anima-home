"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { showErrorToast, showSuccessToast } from "@/lib/utils/showToastMessage";

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
  const [files, setFiles] = useState<File[]>([]);
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selected = Array.from(e.target.files);
    setFiles((prev) => (multiple ? [...prev, ...selected] : selected));
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = () => {
    if (files.length === 0) return;

    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    formData.append("folder", folderName);

    const xhr = new XMLHttpRequest();

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
        setFiles([]);
        setProgress(0);
        showSuccessToast("فایل ها با موفقیت آپلود شد", "bottom-right");
      } else {
        console.error("Upload failed", xhr.responseText);
        showErrorToast("خطا در آپلود فایل ها", "bottom-right");
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
    <div className="space-y-3">
      <Label>{label}</Label>
      <Input
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileChange}
        disabled={isUploading}
      />
      {files.length > 0 && (
        <ul className="space-y-1">
          {files.map((file, index) => (
            <li
              key={index}
              className="bg-muted flex items-center justify-between rounded p-2"
            >
              <span className="truncate text-sm">{file.name}</span>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => handleRemoveFile(index)}
                type="button"
              >
                <X className="h-4 w-4" />
              </Button>
            </li>
          ))}
        </ul>
      )}
      {isUploading && (
        <div className="space-y-1">
          <Progress value={progress} />
          <p className="text-muted-foreground text-xs">{progress}%</p>
        </div>
      )}
      {files.length > 0 && (
        <Button
          onClick={handleUpload}
          disabled={isUploading}
          variant={isUploading ? "secondary" : "default"}
        >
          {isUploading ? "در حال آپلود..." : "آپلود فایل‌ها"}
        </Button>
      )}
    </div>
  );
}

export default FileUploader;
