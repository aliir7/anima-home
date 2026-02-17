type ProductCategoryFilterProps = {
  products: Array<{
    category: {
      id: string;
      title: string;
    };
  }>;
};

function ProductCategoryFilter({ products }: ProductCategoryFilterProps) {
  const categories = Array.from(
    new Map(products.map((p) => [p.category.id, p.category])).values(),
  );
  return (
    <div className="rounded-lg border p-4">
      <h2 className="mb-4 font-semibold">دسته‌بندی</h2>

      <ul className="space-y-2">
        {categories.map((cat) => (
          <li
            key={cat.id}
            className="hover:text-primary cursor-pointer text-sm"
          >
            {cat.title}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProductCategoryFilter;
