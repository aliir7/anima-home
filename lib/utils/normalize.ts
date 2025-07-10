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
