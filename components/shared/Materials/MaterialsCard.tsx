import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

type MaterialCardProps = {
  title: string;
  description?: string;
  image?: string;
  pdfUrl: string;
};

export function MaterialCard({
  title,
  description,
  image,
  pdfUrl,
}: MaterialCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden shadow transition hover:shadow-lg">
      <CardHeader>
        {image ? (
          <div className="relative h-48 w-full">
            <Image
              src={image}
              alt={title}
              fill
              className="rounded-lg object-cover"
              unoptimized={true}
            />
          </div>
        ) : (
          <div className="bg-muted flex h-48 items-center justify-center">
            <span className="text-muted-foreground">بدون تصویر</span>
          </div>
        )}
        <CardTitle className="mt-2 text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {description && (
          <p className="text-muted-foreground line-clamp-3 text-sm">
            {description}
          </p>
        )}
      </CardContent>
      <CardFooter className="mt-auto">
        <Button asChild className="w-full rounded-full">
          <Link href={pdfUrl} target="_blank">
            مشاهده PDF
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
