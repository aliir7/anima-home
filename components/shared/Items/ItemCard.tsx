import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { getStorageUrl } from "@/lib/utils/urlUtils";

type ItemCardProps = {
  title: string;
  description?: string;
  imageUrl: string | string[];
  priority?: boolean;
  href: string;
  buttonText?: string;
  showDescription?: boolean;
};

function ItemCard({
  title,
  description,
  imageUrl,
  href,
  priority,
  showDescription = true,
  buttonText = "مشاهده",
}: ItemCardProps) {
  const firstImage = typeof imageUrl === "string" ? imageUrl : imageUrl?.[0];

  if (!firstImage) return null;

  const imageSrc = getStorageUrl(firstImage);

  return (
    <Card className="flex h-full flex-col overflow-hidden transition-shadow hover:shadow-xl">
      <CardHeader className="px-4">
        <div className="relative h-48 w-full">
          <Image
            src={imageSrc}
            alt={title}
            fill
            priority={priority}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            quality={75}
            className="rounded-lg object-cover"
          />
        </div>
      </CardHeader>

      <div className="flex flex-1 flex-col justify-between">
        <CardContent className="space-y-2 px-8 py-4 text-right">
          <CardTitle className="mt-1 mb-2 text-lg">{title}</CardTitle>

          {description && showDescription && (
            <p className="text-muted-foreground mt-2 mb-4 line-clamp-2 text-sm leading-6">
              {description}
            </p>
          )}
        </CardContent>

        <CardFooter className="mt-auto px-4 pt-0 pb-6">
          <Button asChild className="w-full rounded-full">
            <Link href={href}>{buttonText}</Link>
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
}

export default ItemCard;
