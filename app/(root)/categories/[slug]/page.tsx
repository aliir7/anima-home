import { dummyProjects } from "@/db/sampleData";
import Image from "next/image";
import Link from "next/link";
import VideoPlayer from "@/components/shared/VideoPlayer";

type ProductPageProps = {
  params?: Promise<{ slug: string }>;
  data?: unknown[];
  limit?: number;
};

async function ProductPage({ limit }: ProductPageProps) {
  const data = dummyProjects;

  const limitedData = limit ? data.slice(0, limit) : data;
  if (limitedData.length === 0) {
    return (
      <p className="text-center text-2xl font-semibold">
        فعلا محصولی موجود نیست
      </p>
    );
  }
  return (
    <>
      {limitedData.map((product) => (
        <section key={product.id} className="container py-10">
          <h3 className="mb-2 text-3xl font-bold">{product.title}</h3>
          <p className="text-muted-foreground mb-4">{product.title}</p>
          <div className="mb-6">
            <span className="text-sm">دسته‌بندی: </span>
            <Link
              href={`/categories/${product.slug}`}
              className="text-sm text-blue-600 hover:underline"
            >
              {product.category.name}
            </Link>
          </div>
          {/* نمایش تصاویر */}
          {product.images?.length > 0 && (
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              {product.images.map((img, index) => (
                <div key={index} className="overflow-hidden rounded-lg border">
                  <Image
                    src={img}
                    alt={product.title}
                    width={400}
                    height={300}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
          {/* نمایش ویدیوها */}
          {product.videos?.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">ویدیوهای محصول</h2>
              {product.videos.map((video, vindex) => (
                <VideoPlayer key={vindex} src={video.at(0)!} />
              ))}
            </div>
          )}
        </section>
      ))}
    </>
  );
}

export default ProductPage;
