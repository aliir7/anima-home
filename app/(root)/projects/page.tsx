import { Metadata } from "next";
import ProjectContent from "./ProjectContent";

export const metadata: Metadata = { title: "پروژه‌ها" };

// ✅ تابع صفحه به صورت async
function ProjectsPage() {
  return <ProjectContent />;
}

export default ProjectsPage;
