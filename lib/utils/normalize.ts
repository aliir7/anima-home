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
    ...project,
    images: Array.isArray(project.images) ? project.images : [],
    videos: Array.isArray(project.videos) ? project.videos : [],
    category: project.category ?? undefined,
  } as ProjectWithCategory;
}
