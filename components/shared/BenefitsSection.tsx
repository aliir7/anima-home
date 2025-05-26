import { Truck, ShieldCheck, PhoneCall } from "lucide-react";

const BENEFITS = [
  {
    icon: Truck,
    title: "ارسال سریع",
    description: "تحویل سریع به سراسر ایران با بسته‌بندی امن",
  },
  {
    icon: ShieldCheck,
    title: "ضمانت کیفیت",
    description: "تمام محصولات دارای گارانتی اصالت و سلامت فیزیکی هستند",
  },
  {
    icon: PhoneCall,
    title: "مشاوره رایگان",
    description:
      "قبل از خرید با مشاوران ما گفتگو کنید و بهترین انتخاب را داشته باشید",
  },
];

function BenefitsSection() {
  return (
    <section className="bg-muted/60 rounded-lg px-6 py-16 dark:bg-[#1a1a1a]">
      <div className="wrapper text-center">
        <h2 className="h2-bold text-primary mb-12">چرا آنیماهوم؟</h2>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
          {BENEFITS.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div
                key={index}
                className="group bg-background border-border hover:border-primary dark:bg-muted rounded-2xl border p-6 shadow transition hover:shadow-lg"
              >
                <div className="mb-4 flex justify-center">
                  <div className="bg-primary/10 text-primary group-hover:bg-primary rounded-full p-3 transition group-hover:text-white">
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
                <h3 className="mt-4 mb-2 text-lg font-bold dark:text-neutral-200">
                  {benefit.title}
                </h3>
                <p className="text-muted-foreground mt-4 text-sm leading-6">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default BenefitsSection;
