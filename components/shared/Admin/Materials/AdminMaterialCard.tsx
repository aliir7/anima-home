"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { deleteMaterial } from "@/lib/actions/materials.actions";

type AdminMaterialCardProps = {
  id: string;
  title: string;
  description?: string;
  image?: string;
  pdfUrl: string;
};

export function AdminMaterialCard({
  id,
  title,
  description,
  image,
  pdfUrl,
}: AdminMaterialCardProps) {
  const onDelete = async () => {
    if (confirm("آیا مطمئن هستید که می‌خواهید این متریال را حذف کنید؟")) {
      await deleteMaterial(id);
    }
  };

  return (
    <Card className="flex flex-col overflow-hidden">
      {image && (
        <CardHeader className="p-0">
          <div className="relative h-40 w-full">
            <Image
              src={image}
              alt={title}
              fill
              unoptimized
              className="object-cover"
            />
          </div>
        </CardHeader>
      )}
      <CardContent className="space-y-2 p-4 text-right">
        <CardTitle className="text-base">{title}</CardTitle>
        {description && (
          <p className="text-muted-foreground line-clamp-2 text-sm">
            {description}
          </p>
        )}
        <a
          href={pdfUrl}
          target="_blank"
          className="text-primary text-sm underline"
        >
          مشاهده PDF
        </a>
      </CardContent>
      <CardFooter className="p-4">
        <Button variant="destructive" className="w-full" onClick={onDelete}>
          حذف
        </Button>
      </CardFooter>
    </Card>
  );
}
