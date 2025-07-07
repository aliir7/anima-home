import { services } from "@/lib/constants";
import Link from "next/link";
import ServiceItem from "./ServiceItem";
import { Button } from "@/components/ui/button";

function ServicesSection() {
  return (
    <section className="bg-muted/60 rounded-lg px-6 py-16 dark:bg-[#1a1a1a]">
      <div className="wrapper text-center">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <ServiceItem
                key={index}
                title={service.title}
                description={service.description}
                href={service.href}
                btnText={service.btnText}
                Icon={Icon}
              />
            );
          })}
        </div>
        <Button
          asChild
          variant="default"
          className="bg-primary hover:bg-hoverBtn mt-12 rounded-full px-6 py-4 text-sm font-semibold text-white transition md:px-8 md:py-6 dark:bg-neutral-200 dark:text-neutral-950 dark:hover:bg-neutral-400"
        >
          <Link href="https://telegram.me/AnimaHomeDecor" target="_blank">
            دریافت مشاوره
          </Link>
        </Button>
      </div>
    </section>
  );
}

export default ServicesSection;
