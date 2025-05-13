// import ProductCard from "./ProductCard";

interface ProductListProps {
  data: unknown;

  limit?: number;
}

function ProductList({}: ProductListProps) {
  // if (data.length === 0)
  //   return (
  //     <div className="text-muted-foreground py-12 text-center">
  //       <p className="text-lg">هیچ محصولی در حال حاضر موجود نیست 😢</p>
  //     </div>
  //   );
  // const limitedData = limit ? data.slice(0, limit) : data;

  return (
    // <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
    //   {limitedData.map((product:unknown[]) => (
    //     <ProductCard key={product.id} product={product} />
    //   ))}
    // </div>
    <>productlist</>
  );
}

export default ProductList;
