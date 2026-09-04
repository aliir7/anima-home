import ProductDetailsClient from "@/components/shared/Shop/Product/ProductDetailsClient";
import {
  getProductBySeoSlug,
  getProductBySlug,
} from "@/db/queries/productQueries";
import { getMyCart } from "@/lib/actions/cart.actions";
import {
  getProductReviews,
  getReviewEligibility,
} from "@/lib/actions/review.actions";
import { getCurrentSession } from "@/lib/auth/authGuard";
import { ROOT_URL } from "@/lib/constants";
import { Cart } from "@/types";
import { Metadata } from "next";
import { notFound } from "next/navigation";

type ProductDetailsPageProps = {
  params: Promise<{
    seoSlug: string;
  }>;
};

// =================================================================
// Metadata
// =================================================================

export async function generateMetadata({
  params,
}: ProductDetailsPageProps): Promise<Metadata> {
  const { seoSlug } = await params;

  const res = await getProductBySeoSlug(seoSlug);

  if (!res.success || !res.data) {
    return {
      title: "پروژه پیدا نشد",
    };
  }

  const product = res.data;

  const canonical = `${ROOT_URL}/products/${product.seoSlug}`;

  const firstImage = product.variants.at(0)?.images.at(0);

  return {
    title: product.title,
    description: product.description ?? "",

    alternates: {
      canonical,
    },

    openGraph: {
      title: product.title,
      description: product.description ?? "",
      url: canonical,

      images: firstImage
        ? [
            {
              url: firstImage.startsWith("http")
                ? firstImage
                : `${ROOT_URL}${firstImage}`,
              width: 1200,
              height: 630,
              alt: product.title,
            },
          ]
        : undefined,
    },
  };
}

// =================================================================
// Page
// =================================================================

export default async function ProductDetailsPage({
  params,
}: ProductDetailsPageProps) {
  const { seoSlug } = await params;
  const productResult = await getProductBySlug(seoSlug);
  if (!productResult.success || !productResult.data) {
    notFound();
  }
  const product = productResult.data;
  const session = await getCurrentSession();
  const userId = session?.user?.id;
  const cart = (await getMyCart()) as Cart;

  const [reviewsResult, eligibility] = await Promise.all([
    getProductReviews(product.id, 1),
    getReviewEligibility(product.id),
  ]);

  const initialReviews =
    reviewsResult.success && reviewsResult.data
      ? reviewsResult.data.reviews
      : [];
  const initialHasMore =
    reviewsResult.success && reviewsResult.data
      ? reviewsResult.data.hasMore
      : false;

  return (
    <ProductDetailsClient
      product={product}
      userId={userId}
      cart={cart}
      initialReviews={initialReviews}
      initialHasMore={initialHasMore}
      eligibility={eligibility}
    />
  );
}
