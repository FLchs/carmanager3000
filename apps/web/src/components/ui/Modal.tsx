import { type ReactNode, useLayoutEffect, useRef } from "react";

function Modal({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);

  useLayoutEffect(() => {
    if (!ref.current) return;
    ref.current?.showModal();
    ref.current.className = ref.current?.className + " active";
  }, []);

  return (
    <dialog
      className="bg-bg border-border text-text m-auto flex flex-col gap-4 rounded-lg border-1 px-4 py-2"
      ref={ref}
    >
      {children}
    </dialog>
  );
}

export default Modal;
