import clsx from "clsx";
import { toast } from "sonner";

export const showSuccessToast = (msg: string) =>
  toast.success(msg, {
    description: msg,
    className: clsx(
      "px-6 py-4 rounded-xl text-base shadow-md border",
      "bg-green-50 text-green-800 border-green-300",
      "dark:bg-green-900 dark:text-green-100 dark:border-green-700",
    ),
    position: "top-right",
  });

export const showErrorToast = (msg: string) =>
  toast.error(msg, {
    description: msg,
    className: clsx(
      "px-6 py-4 rounded-xl text-base shadow-md border",
      "bg-red-50 text-red-800 border-red-300",
      "dark:bg-red-900 dark:text-red-100 dark:border-red-700",
    ),

    position: "top-right",
  });
