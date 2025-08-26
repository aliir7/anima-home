import { ChevronLeft } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbItem,
} from "../ui/breadcrumb";

function BreadcrumbSection() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">صفحه اصلی</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <ChevronLeft />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbLink href="/projects">پروژه ها</BreadcrumbLink>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export default BreadcrumbSection;
