import ItemCard from "./ItemCard";

type Item = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  slug: string;
};

type ItemListProps = {
  category: string;
  page: number;
  basePath: string;
};

function ItemList({ category, basePath, page }: ItemListProps) {
  // TODO: فراخوانی دیتابیس برای گرفتن داده با category و page
  // نمونه داده:
  const allItems: Item[] = Array.from({ length: 30 }).map((_, i) => ({
    id: `${i + 1}`,
    title: `${basePath.slice(1)} شماره ${i + 1}`,
    description: `توضیحی برای آیتم شماره ${i + 1}`,
    imageUrl: "/placeholder.svg",
    slug: `${basePath.slice(1)}-${i + 1}`,
  }));

  // فیلتر بر اساس category (اگر category خالی نبود)
  const filtered = category
    ? allItems.filter((item) => item.id === category) // اینجا باید فیلتر واقعی بر اساس دسته‌بندی باشه
    : allItems;

  const pageSize = 6;
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {paginated.map((item) => (
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
