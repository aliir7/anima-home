import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

function FAQPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-primary mb-8 text-center text-3xl font-bold sm:mb-10 sm:text-2xl">
        سوالات متداول
      </h1>
      <Accordion
        type="single"
        collapsible
        className="mx-auto w-full max-w-2xl space-y-6"
      >
        <AccordionItem value="q1">
          <AccordionTrigger>چطور می‌تونم سفارش ثبت کنم؟</AccordionTrigger>
          <AccordionContent>
            برای ثبت سفارش، محصول مورد نظر را به سبد خرید اضافه کنید و سپس وارد
            مرحله پرداخت شوید.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="q2">
          <AccordionTrigger>هزینه ارسال چقدره؟</AccordionTrigger>
          <AccordionContent>
            هزینه ارسال برای سفارش‌های بالای ۵۰۰ هزار تومان رایگان و برای مبالغ
            کمتر، ثابت و ۳۰ هزار تومان است.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="q3">
          <AccordionTrigger>آیا امکان بازگشت کالا وجود دارد؟</AccordionTrigger>
          <AccordionContent>
            بله، تا ۷ روز پس از تحویل کالا امکان بازگشت طبق شرایط بازگشت کالا
            وجود دارد.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="q4">
          <AccordionTrigger>
            چطور می‌تونم با پشتیبانی تماس بگیرم؟
          </AccordionTrigger>
          <AccordionContent>
            از طریق صفحه تماس با ما، یا شماره تماس موجود در پایین سایت می‌تونید
            با ما در ارتباط باشید.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

export default FAQPage;
