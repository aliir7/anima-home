import BreadcrumbSection from "@/components/shared/BreadcrumbSection";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Metadata } from "next";

export const revalidate = 86400; // 1 day

export const metadata: Metadata = {
  title: "سوالات متداول",
};

function FAQPage() {
  return (
    <div className="wrapper mx-auto px-4 py-16">
      <BreadcrumbSection
        items={[
          { label: "صفحه اصلی ", href: "/" },
          {
            label: "سوالات متداول",
            href: "/faq",
          },
        ]}
      />
      <h1 className="text-primary mb-8 pb-4 text-center text-3xl font-bold sm:mb-10 sm:text-2xl dark:text-neutral-900">
        سوالات متداول
      </h1>
      <Accordion
        type="single"
        collapsible
        className="mx-auto w-full max-w-2xl space-y-6"
      >
        <AccordionItem value="q1">
          <AccordionTrigger className="dark:text-neutral-800">
            چطور می‌تونم سفارش ثبت کنم؟
          </AccordionTrigger>
          <AccordionContent className="mt-2 mr-4 mb-4 dark:text-neutral-600">
            برای ثبت سفارش، محصول مورد نظر را به سبد خرید اضافه کنید و سپس وارد
            مرحله پرداخت شوید.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="q2">
          <AccordionTrigger className="dark:text-neutral-800">
            هزینه ارسال چقدره؟
          </AccordionTrigger>
          <AccordionContent className="mt-2 mr-4 mb-4 dark:text-neutral-600">
            هزینه ارسال برای سفارش‌های بالای ۵۰۰ هزار تومان رایگان و برای مبالغ
            کمتر، ثابت و ۳۰ هزار تومان است.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="q3">
          <AccordionTrigger className="dark:text-neutral-800">
            آیا امکان بازگشت کالا وجود دارد؟
          </AccordionTrigger>
          <AccordionContent className="mt-2 mr-4 mb-4 dark:text-neutral-600">
            بله، تا ۷ روز پس از تحویل کالا امکان بازگشت طبق شرایط بازگشت کالا
            وجود دارد.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="q4">
          <AccordionTrigger className="dark:text-neutral-800">
            چطور می‌تونم با پشتیبانی تماس بگیرم؟
          </AccordionTrigger>
          <AccordionContent className="mt-2 mr-4 mb-4 dark:text-neutral-600">
            از طریق صفحه تماس با ما، یا شماره تماس موجود در پایین سایت می‌تونید
            با ما در ارتباط باشید.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

export default FAQPage;
