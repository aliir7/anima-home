import ItemCard from "./ItemCard";

type Item = {
  id: string;
  title: string;
  description: string;
  imageUrl: string | string[];
  slug: string;
};

type ItemListProps = {
  items: Item[];
  basePath: string;
};

function ItemList({ items, basePath }: ItemListProps) {
  if (!items.length) {
    return (
      <p className="text-muted-foreground py-8 text-center">موردی یافت نشد.</p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <ItemCard
          key={item.id}
          title={item.title}
          description={item.description}
          imageUrl={item.imageUrl}
          href={`${basePath}/${item.slug}`}
        />
      ))}
    </div>
  );
}

export default ItemList;
