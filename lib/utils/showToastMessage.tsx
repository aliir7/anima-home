import { toast } from "sonner";

type Position =
  | "bottom-center"
  | "bottom-left"
  | "bottom-right"
  | "top-center"
  | "top-left"
  | "top-right";

const DURATION = 5000;

export const showSuccessToast = (
  msg: string,
  position: Position,
  desc?: string,
) =>
  toast.success(msg, {
    position,
    duration: DURATION,
    description: (
      <>
        {desc && <p className="text-xs opacity-80">{desc}</p>}
        <div
          className="sonner-progress sonner-success"
          style={{ animationDuration: `${DURATION}ms` }}
        />
      </>
    ),
  });

export const showErrorToast = (
  msg: string,
  position: Position,
  desc?: string,
) =>
  toast.error(msg, {
    position,
    duration: DURATION,
    description: (
      <>
        {desc && <p className="text-xs opacity-80">{desc}</p>}
        <div
          className="sonner-progress sonner-error"
          style={{ animationDuration: `${DURATION}ms` }}
        />
      </>
    ),
  });
