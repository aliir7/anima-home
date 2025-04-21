import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="bg-background text-primary flex h-screen flex-col items-center justify-center">
      <Loader2 className="mb-4 h-12 w-12 animate-spin" />
      <p className="text-lg font-medium">در حال بارگذاری آنیما هوم...</p>
    </div>
  );
}
