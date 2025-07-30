import { toast } from "sonner";

type Position =
  | "bottom-center"
  | "bottom-left"
  | "bottom-right"
  | "top-center"
  | "top-left"
  | "top-right";

export const showSuccessToast = (
  msg: string,
  position: Position,
  desc?: string,
) =>
  toast.success(msg, {
    description: desc ?? "",
    position: position,
  });

export const showErrorToast = (msg: string, position: Position) =>
  toast.error(msg, {
    position: position,
  });
