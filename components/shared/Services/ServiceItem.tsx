import { Button } from "../../ui/button";
import Link from "next/link";

import type { TypeIcon } from "lucide-react";

type ServiceItemProps = {
  title: string;
  description: string;
  href: string;
  btnText: string;
  Icon: typeof TypeIcon;
};

function ServiceItem({
  title,
  description,
  href,
  btnText,
  Icon,
}: ServiceItemProps) {
  return (
    <div className="group bg-background border-border hover:border-primary active:border-primary dark:bg-muted flex flex-col justify-between rounded-2xl border p-6 shadow transition hover:shadow-lg active:shadow-lg">
      <div>
        <div className="mb-4 flex justify-center">
          <div className="bg-primary/10 text-primary group-hover:bg-primary group-active:bg-primary rounded-full p-3 transition group-hover:text-white group-active:text-white">
            <Icon className="h-6 w-6 dark:text-neutral-50 dark:hover:text-neutral-950 dark:active:text-neutral-950" />
          </div>
        </div>
        <h3 className="mt-4 mb-2 text-lg font-bold dark:text-neutral-200">
          {title}
        </h3>
        <p className="text-muted-foreground mt-4 mb-2 text-sm leading-6">
          {description}
        </p>
      </div>
      <div className="mt-6 flex items-center justify-center">
        <Button
          variant="outline"
          asChild
          className="text-primary hover:text-primary/80 border-primary rounded-full px-6 py-4 text-sm font-semibold transition md:px-8 md:py-6 dark:text-white dark:hover:text-neutral-200 dark:active:text-neutral-200"
        >
          <Link href={href}>{btnText}</Link>
        </Button>
      </div>
    </div>
  );
}

export default ServiceItem;
