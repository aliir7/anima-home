"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { plans } from "@/lib/constants";
import Link from "next/link";

function CabinetOfferSection() {
  return (
    <section className="mx-auto mt-10 max-w-2xl px-6 py-12">
      <div className="mx-auto flex items-center justify-center gap-8">
        {plans.map((plan, i) => (
          <div
            key={i}
            className={`relative flex flex-col rounded-3xl border bg-white p-8 shadow-md transition hover:shadow-xl dark:border-neutral-800 ${
              plan.popular
                ? "border-primary ring-primary shadow-lg ring-2"
                : "border-muted"
            }`}
          >
            {plan.popular && (
              <span className="bg-primary absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-xs font-semibold text-white dark:bg-neutral-950">
                محبوب‌ترین
              </span>
            )}

            <h3 className="mb-6 text-center text-lg font-bold md:mb-3 md:text-xl">
              {plan.title}
            </h3>
            <p className="text-muted-foreground mb-8 text-center text-xs md:text-sm dark:text-neutral-500">
              {plan.description}
            </p>
            {/* {plans.price && (
              <p className="text-primary mb-6 text-center text-2xl font-bold">
                {plan.price}
              </p>
            )} */}

            <ul className="mb-10 flex-1 space-y-2 text-xs md:text-sm">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <Button
              asChild
              className={`w-full rounded-full py-2 text-xs md:text-sm dark:bg-neutral-950 dark:hover:bg-neutral-700 ${
                plan.popular ? "bg-primary text-white" : "bg-muted"
              }`}
            >
              <Link
                target="_blank"
                href="https://wa.me/989129277302"
                aria-label="Whatsapp"
              >
                دریافت مشاوره
              </Link>
            </Button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default CabinetOfferSection;
