import {
  Material,
  MaterialFormValues,
  ProjectFormValues,
  ProjectWithCategory,
} from "@/types";

export function normalizeProjectForForm(
  project: ProjectWithCategory,
): ProjectFormValues {
  return {
    id: project.id,
    title: project.title,
    seoSlug: project.seoSlug ?? "",
    description: project.description ?? "",
    images: Array.isArray(project.images) ? project.images : [],
    videos: Array.isArray(project.videos) ? project.videos : [],
    categoryId: project.categoryId,
  };
}

export function normalizeProject(
  project: Partial<ProjectWithCategory>,
): ProjectWithCategory {
  return {
    ...project,
    images:
      Array.isArray(project.images) &&
      project.images.every((i) => typeof i === "string")
        ? project.images
        : [],
    videos:
      Array.isArray(project.videos) &&
      project.videos.every((v) => typeof v === "string")
        ? project.videos
        : [],
    category: project.category ?? undefined,
  } as ProjectWithCategory;
}

export function normalizeMaterialForForm(
  material: Material,
): MaterialFormValues & { id: string } {
  return {
    id: material.id,
    title: material.title ?? "",
    description: material.description ?? "",
    image: material.image ?? "",
    pdfUrl: material.image ?? "",
  };
}

import type { ProductWithRelations } from "@/types";

export function normalizeProduct(
  product: ProductWithRelations,
): ProductWithRelations {
  return {
    ...product,
    variants: product.variants.map((variant) => ({
      ...variant,
      specs: (variant.specs ?? {}) as Record<string, string>,
      images: (variant.images ?? []) as string[],
    })),
  };
}
