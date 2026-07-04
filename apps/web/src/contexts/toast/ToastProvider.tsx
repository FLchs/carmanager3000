import { createContext, useRef, type PropsWithChildren, type RefObject } from "react";

import { ToastStack } from "#/components/ui/toast/ToastStack";

export type ToastPayload = {
  content: string;
  type?: "success" | "error";
};

type ToastContextValue = {
  pushToastRef: RefObject<(payload: ToastPayload) => void>;
};

const defaultPushToast: (payload: ToastPayload) => void = () => {
  throw new Error("Hook used outside context");
};

const defaultValue: ToastContextValue = {
  pushToastRef: { current: defaultPushToast },
};

export const ToastContext = createContext(defaultValue);

export function ToastProvider({ children }: PropsWithChildren) {
  const pushToastRef = useRef(defaultPushToast);
  return (
    <ToastContext.Provider value={{ pushToastRef }}>
      <ToastStack />
      {children}
    </ToastContext.Provider>
  );
}
