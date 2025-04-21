import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
interface ProductCardProps {
  product: any;
}

function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="group overflow-hidden rounded-2xl border shadow-md transition hover:shadow-lg">
      <div className="relative aspect-[4/3]">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover"
        />
        {!product.stock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-lg font-bold text-white">
            ناموجود
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="line-clamp-1 text-base font-semibold">
              {product.name}
            </h3>
            <p className="text-muted-foreground text-sm">
              {product.price.toLocaleString()} تومان
            </p>
          </div>
          {product.stock && (
            <Badge
              className="rounded-full px-4 py-2 text-xs"
              variant="default"
              asChild
            >
              <Link href="/products">
                <ShoppingCart className="me-1 inline-block h-4 w-4" /> خرید
              </Link>
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default ProductCard;
