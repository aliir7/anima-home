import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// import { ROOT_URL } from "@/lib/constants";

import Image from "next/image";
import Link from "next/link";

type ItemCardProps = {
  title: string;
  description: string;
  imageUrl: string;
  href: string;
  buttonText?: string;
  showDescription?: boolean;
  imageHeight?: number;
};

function ItemCard({
  title,
  description,
  imageUrl,
  href,
  showDescription = true,
  buttonText = "مشاهده",
}: ItemCardProps) {
  const fullImageUrl = imageUrl.startsWith("http")
    ? imageUrl
    : `https://anima-home.ir${imageUrl}`;
  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-xl">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full">
          <Image
            src={fullImageUrl}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
            priority
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-2 px-4 py-4 text-right">
        <CardTitle className="text-lg">{title}</CardTitle>
        {description && showDescription && (
          <p className="text-muted-foreground line-clamp-2 text-sm">
            {description}
          </p>
        )}
      </CardContent>
      <CardFooter className="px-4 pt-0 pb-4">
        <Button asChild className="w-full rounded-full" variant="default">
          <Link href={href}>{buttonText}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default ItemCard;
