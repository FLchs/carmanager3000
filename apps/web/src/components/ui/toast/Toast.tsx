import { clsx } from "clsx";
import type { ToastProps } from "./ToastStack";
import { useCallback, useState } from "react";

const TOAST_VARIANTS = {
  error: "bg-danger",
  success: "bg-success",
} as const;

export function Toast({ toast, onClose }: { toast: ToastProps; onClose: (id: number) => void }) {
  const [clicked, setClicked] = useState(false);

  const handleClose = useCallback(() => {
    setClicked(true);
  }, []);

  const handleTransitionEnd = useCallback(() => {
    if (clicked) {
      onClose(toast.id);
    }
  }, [onClose, toast.id, clicked]);

  return (
    <div
      onClick={handleClose}
      className={clsx(
        "w-72 transform cursor-pointer rounded-lg px-4 py-2 text-text transition-all duration-300 ease-in",
        "animate-[slide-in_300ms_ease-out_forwards]",
        toast.type ? TOAST_VARIANTS[toast.type] : "bg-bg",
        clicked ? "translate-x-[110%] opacity-0" : "animate-[slide-in_300ms_ease-out_forwards]",
      )}
      onTransitionEnd={handleTransitionEnd}
    >
      <div className="mb-2 font-bold">{toast.content}</div>
      <div className="w-full">
        <div
          className={clsx(
            "h-1 origin-left bg-bg-light",
            `animate-[timer-bar_5000ms_linear_forwards] `,
            "transition-all duration-100 ease-out",
            clicked ? "opacity-0" : "opacity-100",
          )}
          onAnimationEnd={handleClose}
        />
      </div>
    </div>
  );
}
