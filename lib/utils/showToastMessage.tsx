import { toast } from "sonner";

export const showSuccessToast = (msg: string) =>
  toast.success(msg, {
    className: "bg-green-100 text-green-800 border-green-300",
    icon: "✅",
  });

export const showErrorToast = (msg: string) =>
  toast.error(msg, {
    className: "bg-red-100 text-red-800 border-red-300",
    icon: "❌",
  });
