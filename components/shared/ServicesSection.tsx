import { services } from "@/lib/constants";
import { Button } from "../ui/button";
import Link from "next/link";

function ServicesSection() {
  return (
    <section className="bg-muted/60 rounded-lg px-6 py-16 dark:bg-[#1a1a1a]">
      <div className="wrapper text-center">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                className="group bg-background border-border hover:border-primary dark:bg-muted rounded-2xl border p-6 shadow transition hover:shadow-lg"
              >
                <div className="mb-4 flex justify-center">
                  <div className="bg-primary/10 text-primary group-hover:bg-primary rounded-full p-3 transition group-hover:text-white">
                    <Icon className="h-6 w-6 dark:text-neutral-900" />
                  </div>
                </div>
                <h3 className="mt-4 mb-2 text-lg font-bold dark:text-neutral-200">
                  {service.title}
                </h3>
                <p className="text-muted-foreground mt-4 mb-2 text-sm leading-6">
                  {service.description}
                </p>
                <div className="flex items-center justify-center">
                  <Button
                    variant="outline"
                    asChild
                    className="rounded-full px-6 py-4 text-sm font-semibold text-neutral-900 transition hover:text-neutral-700 md:px-8 md:py-6 dark:text-white dark:hover:text-neutral-200"
                  >
                    <Link href={service.href}>{service.btnText}</Link>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default ServicesSection;
