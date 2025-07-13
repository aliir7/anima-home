// components/shared/FileUploader.tsx
"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";

type FileUploaderProps = {
  onUploaded: (url: string) => void;
  label: string;
  accept: string;
};

function FileUploader({ onUploaded, label, accept }: FileUploaderProps) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (data.url) {
      onUploaded(data.url);
    }
    setUploading(false);
  };

  return (
    <div className="space-y-2">
      <label className="block font-medium">{label}</label>
      <Input type="file" accept={accept} onChange={handleUpload} />
      {uploading && (
        <p className="text-muted-foreground text-sm">در حال آپلود...</p>
      )}
    </div>
  );
}

export default FileUploader;
