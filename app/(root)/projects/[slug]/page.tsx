import ImageGallery from "@/components/shared/ImageGallery";
import VideoPlayer from "@/components/shared/VideoPlayer";
import { getProjectBySlug } from "@/db/queries/projectQueries";
import generateMetadata from "@/lib/utils/generateMetadata";
import { notFound } from "next/navigation";

type ProjectDetailsPageProps = {
  params: Promise<{ slug: string }>;
};

async function ProjectDetailsPage({ params }: ProjectDetailsPageProps) {
  const slug = (await params).slug;
  const res = await getProjectBySlug(slug);

  if (!res.success || !res.data) return notFound();

  // if data fetched successfully
  const project = res.data;
  generateMetadata(params);

  return (
    <section className="wrapper space-y-6 py-10">
      <h2 className="text-2xl font-bold">{project.title}</h2>
      <p className="text-muted-foreground text-right">{project.description}</p>
      {project.images?.length > 0 && <ImageGallery images={project.images} />}
      {project.videos?.length > 0 && <VideoPlayer src={project.videos} />}
    </section>
  );
}

export default ProjectDetailsPage;
