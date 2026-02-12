import { useCallback, useContext } from "react";

import { ToastContext, type ToastPayload } from "#/contexts/toast/ToastProvider";

export function useToast() {
  const { pushToastRef } = useContext(ToastContext);

  return {
    pushToast: useCallback(
      (toast: ToastPayload) => {
        pushToastRef.current(toast);
      },
      [pushToastRef],
    ),
  };
}
