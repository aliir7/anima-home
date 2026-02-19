import ProductDetailsClient from "@/components/shared/Shop/Product/ProductDetailsClient";
import { getProductBySlug } from "@/db/queries/productQueries";
import { getMyCart } from "@/lib/actions/cart.actions";
import { auth } from "@/lib/auth";
import { Cart } from "@/types";
import { notFound } from "next/navigation";

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ seoSlug: string }>;
}) {
  const { seoSlug } = await params;
  const productResult = await getProductBySlug(seoSlug);
  if (!productResult.success || !productResult.data) {
    notFound();
  }
  const product = productResult.data;
  const session = await auth();
  const userId = session?.user?.id;
  const cart = (await getMyCart()) as Cart;

  return <ProductDetailsClient product={product} userId={userId} cart={cart} />;
}
