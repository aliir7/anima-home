import { Card, CardHeader, CardContent, CardFooter } from "../../ui/card";
import { Skeleton } from "../../ui/skeleton";

function ItemCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-0">
        <Skeleton className="h-48 w-full" />
      </CardHeader>
      <CardContent className="space-y-2 px-4 py-4">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </CardContent>
      <CardFooter className="px-4 pt-0 pb-4">
        <Skeleton className="h-10 w-full rounded-full" />
      </CardFooter>
    </Card>
  );
}

export default ItemCardSkeleton;
