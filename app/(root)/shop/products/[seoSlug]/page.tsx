import ProductDetailsClient from "@/components/shared/Shop/Product/ProductDetailsClient";
import { getProductBySlug } from "@/db/queries/productQueries";
import { notFound } from "next/navigation";

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ seoSlug: string }>;
}) {
  const { seoSlug } = await params;

  const result = await getProductBySlug(seoSlug);

  if (!result.success || !result.data) {
    notFound();
  }

  return <ProductDetailsClient product={result.data} />;
}
