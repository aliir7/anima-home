import BreadcrumbSection from "@/components/shared/BreadcrumbSection";
import ImageGallery from "@/components/shared/ImageGallery";
import VideoPlayer from "@/components/shared/VideoPlayer";
import { getProjectBySeoSlug } from "@/db/queries/projectQueries";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const revalidate = 3600; // 1hour

type ProjectDetailsPageProps = {
  params: Promise<{ seoSlug: string }>;
};
// Next.js will call this automatically
export async function generateMetadata({
  params,
}: ProjectDetailsPageProps): Promise<Metadata> {
  const seoSlug = (await params).seoSlug;

  const res = await getProjectBySeoSlug(seoSlug);
  if (!res.success || !res.data) {
    return { title: "پروژه پیدا نشد" };
  }

  const project = res.data;
  const canonical = `https://anima-home.ir/projects/${project.seoSlug}`;

  return {
    title: "جزییات پروژه ها",
    description: project.description ?? "",
    alternates: { canonical },
    openGraph: {
      title: project.title,
      description: project.description ?? "",
      url: canonical,
      images: project.images?.length
        ? [
            {
              url: project.images[0].startsWith("http")
                ? project.images[0]
                : `https://anima-home.ir${project.images[0]}`,
              width: 1200,
              height: 630,
              alt: project.title,
            },
          ]
        : undefined,
    },
  };
}

async function ProjectDetailsPage({ params }: ProjectDetailsPageProps) {
  const seoSlug = (await params).seoSlug;

  const res = await getProjectBySeoSlug(seoSlug);
  if (!res.success || !res.data) return notFound();

  // if data fetched successfully
  const project = res.data;

  return (
    <section className="wrapper space-y-10 py-12">
      <BreadcrumbSection
        items={[
          { label: "صفحه اصلی", href: "/" },
          { label: "پروژه‌ها", href: "/projects" },
          { label: project.title },
        ]}
      />
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
