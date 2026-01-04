import { Toaster as Sonner } from "sonner";

export function Toaster() {
  return (
    <Sonner
      richColors
      toastOptions={{
        duration: 5000,
        classNames: {
          toast:
            "rtl:flex-row rtl:text-right flex items-center gap-3 " +
            "rounded-md border px-4 py-3 text-sm shadow-lg " +
            "w-[360px] max-w-full relative overflow-hidden",

          success:
            "bg-green-50 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-100 dark:border-green-700",

          error:
            "bg-red-50 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-100 dark:border-red-700",

          warning:
            "bg-yellow-50 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-100 dark:border-yellow-700",

          info: "bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-100 dark:border-blue-700",
        },
      }}
    />
  );
}
