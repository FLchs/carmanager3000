import { useCallback, useContext, useState } from "react";

import { ToastContext } from "#/contexts/toast/ToastProvider";

import { Toast } from "./Toast";

export type ToastProps = {
  id: number;
  content: string;
  type?: "success" | "error";
  timer?: ReturnType<typeof setTimeout>;
};

export function ToastStack() {
  const [toasts, setToasts] = useState<ToastProps[]>([]);
  const { pushToastRef } = useContext(ToastContext);

  const removeToast = useCallback((id: number) => {
    setToasts((current) => current.filter((t) => t.id !== id));
  }, []);

  pushToastRef.current = (toast) => {
    const id = Date.now();
    setToasts((current) => [...current, { ...toast, id }]);
  };

  return (
    <div className="fixed top-0 right-0 flex flex-col gap-2 p-4">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onClose={removeToast} />
      ))}
    </div>
  );
}
