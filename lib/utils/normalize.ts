import { ProjectWithCategory, ProjectFormValues } from "@/types";

export function normalizeProjectForForm(
  project: ProjectWithCategory,
): ProjectFormValues {
  return {
    id: project.id,
    title: project.title,
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
    id: project.id!,
    title: project.title!,
    slug: project.slug!,
    categoryId: project.categoryId!,
    createdAt: project.createdAt ?? null,
    description: project.description ?? "",
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
  };
}
