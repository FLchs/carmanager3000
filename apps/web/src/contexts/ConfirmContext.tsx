import { createContext } from "react";

export type Props = {
  title?: string;
};

export const defaultFunction = (_p?: Props) => Promise.resolve(true);

export const ConfirmContext = createContext({
  confirmRef: {
    current: defaultFunction,
  },
});
