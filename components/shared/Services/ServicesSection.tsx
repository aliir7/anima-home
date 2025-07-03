import { services } from "@/lib/constants";
import ServiceItem from "./ServiceItem";

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
      </div>
    </section>
  );
}

export default ServicesSection;
