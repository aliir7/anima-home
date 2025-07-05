import { RocketIcon } from "lucide-react";
import { cn } from "@/lib/utils/utils";

type ComingSoonProps = {
  className?: string;
};

function ComingSoon({ className }: ComingSoonProps) {
  return (
    <div
      className={cn(
        "text-muted-foreground flex h-[60vh] flex-col items-center justify-center space-y-4 text-center",
        className,
      )}
    >
      <div className="bg-primary/10 flex items-center justify-center rounded-full p-6 dark:bg-neutral-600">
        <RocketIcon className="text-primary h-10 w-10 animate-bounce dark:text-neutral-200" />
      </div>
      <h2 className="text-xl font-semibold dark:text-neutral-900">
        این بخش بزودی راه‌اندازی خواهد شد
      </h2>
      <p className="text-muted-foreground max-w-md text-sm dark:text-neutral-700">
        در حال حاضر این بخش از سایت یا خدمات در حال آماده‌سازی است. به زودی در
        دسترس خواهد بود. ممنون از شکیبایی شما 🙏
      </p>
    </div>
  );
}

export default ComingSoon;
