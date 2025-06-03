import { dummyProjects } from "@/db/sampleData";
import Image from "next/image";
import Link from "next/link";
import VideoPlayer from "@/components/shared/VideoPlayer";
import { getCategoryBySlug } from "@/db/queries/categoriesQueries";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
  data?: unknown[];
  limit?: number;
};

async function ProductPage({ params }: ProductPageProps) {
  // const data = dummyProjects;
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  console.log(category);

  if (!category) {
    return <p>محصولی موجود نیست</p>;
  }

  if (slug === category.slug) {
    return (
      <p className="mt-4 text-center text-2xl font-semibold">{category.name}</p>
    );
  }

  if (slug !== category.name) {
    return <p>محصولی موجود نیست</p>;
  }

  // const limitedData = limit ? data.slice(0, limit) : data;
  // <>
  //   {limitedData.map((product) => (
  //     <section key={product.id} className="container py-10">
  //       <h3 className="mb-2 text-3xl font-bold">{product.title}</h3>
  //       <p className="text-muted-foreground mb-4">{product.title}</p>
  //       <div className="mb-6">
  //         <span className="text-sm">دسته‌بندی: </span>
  //         <Link
  //           href={`/categories/${product.slug}`}
  //           className="text-sm text-blue-600 hover:underline"
  //         >
  //           {product.category.name}
  //         </Link>
  //       </div>
  //       {/* نمایش تصاویر */}
  //       {product.images?.length > 0 && (
  //         <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
  //           {product.images.map((img, index) => (
  //             <div key={index} className="overflow-hidden rounded-lg border">
  //               <Image
  //                 src={img}
  //                 alt={product.title}
  //                 width={400}
  //                 height={300}
  //                 className="h-full w-full object-cover"
  //               />
  //             </div>
  //           ))}
  //         </div>
  //       )}
  //       {/* نمایش ویدیوها */}
  //       {product.videos?.length > 0 && (
  //         <div className="space-y-4">
  //           <h2 className="text-xl font-semibold">ویدیوهای محصول</h2>
  //           {product.videos.map((video, vindex) => (
  //             <VideoPlayer key={vindex} src={video.at(0)!} />
  //           ))}
  //         </div>
  //       )}
  //     </section>
  //   ))}
  // </>
}

export default ProductPage;
