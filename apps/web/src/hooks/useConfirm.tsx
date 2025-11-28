import { use } from "react";

import { ConfirmContext } from "@/contexts/ConfirmContext";

export function useDialog() {
  const {
    confirmRef: { current },
  } = use(ConfirmContext);
  return {
    confirm: current,
  };
}
