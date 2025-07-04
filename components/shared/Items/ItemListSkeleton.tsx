import ItemCardSkeleton from "./ItemCardSkeleton";

type ItemListSkeletonProps = {
  pageSize: number;
};

function ItemListSkeleton({ pageSize }: ItemListSkeletonProps) {
  if (pageSize < 1) {
    return null;
  }
  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
    {Array.from({ length: pageSize }).map((_, i) => (
      <ItemCardSkeleton key={i} />
    ))}
  </div>;
}

export default ItemListSkeleton;
