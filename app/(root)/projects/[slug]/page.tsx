import ImageGallery from "@/components/shared/ImageGallery";
import VideoPlayer from "@/components/shared/VideoPlayer";
import { getProjectBySlug } from "@/db/queries/projectQueries";
import generateMetadata from "@/lib/utils/generateMetadata";
import { notFound } from "next/navigation";

type ProjectDetailsPageProps = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 3600; // 1hour

async function ProjectDetailsPage({ params }: ProjectDetailsPageProps) {
  const slug = (await params).slug;
  const res = await getProjectBySlug(slug);

  if (!res.success || !res.data) return notFound();

  // if data fetched successfully
  const project = res.data;
  generateMetadata(params);

  return (
    <section className="wrapper space-y-10 py-12">
      <div className="space-y-6 text-right">
        <h2 className="text-primary pt-2 text-2xl font-bold md:text-3xl dark:text-neutral-900">
          {project.title}
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          {project.description}
        </p>
      </div>

      {project.images.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-right text-xl font-semibold">گالری تصاویر</h3>
          <ImageGallery images={project.images} title={project.title} />
        </div>
      )}

      {/* خط چین زیبا بین تصاویر و ویدیو */}
      {project.images && project.videos && project.videos.length > 0 && (
        <div className="relative py-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full rounded-full border-t border-dashed border-gray-300 dark:border-gray-600" />
          </div>
          <div className="text-muted-foreground bg-background relative z-10 px-4 text-center text-sm">
            ویدیوهای پروژه
          </div>
        </div>
      )}

      {project.videos && project.videos?.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-right text-xl font-semibold">ویدیو پروژه</h3>
          <VideoPlayer src={project.videos} />
        </div>
      )}
    </section>
  );
}

export default ProjectDetailsPage;
