import { Toaster as Sonner } from "sonner";

export function Toaster() {
  return (
    <Sonner
      richColors
      toastOptions={{
        duration: 5000,
        classNames: {
          toast:
            "rounded-xl shadow-md px-6 py-4 text-base flex items-start gap-4 border rtl:text-right",

          success:
            "bg-green-50 text-green-800 border-green-300 dark:bg-green-900 dark:text-green-100 dark:border-green-700",
          error:
            "bg-red-50 text-red-800 border-red-300 dark:bg-red-900 dark:text-red-100 dark:border-red-700",
          warning:
            "bg-yellow-50 text-yellow-800 border-yellow-300 dark:bg-yellow-900 dark:text-yellow-100 dark:border-yellow-700",
          info: "bg-blue-50 text-blue-800 border-blue-300 dark:bg-blue-900 dark:text-blue-100 dark:border-blue-700",
        },
      }}
    />
  );
}
