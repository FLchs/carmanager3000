import {
  createContext,
  type PropsWithChildren,
  useRef,
  useState,
  useContext,
  useCallback,
  type ReactNode,
  useEffect,
} from "react";
import { createPortal } from "react-dom";

type Params = ReactNode;

const defaultFunction = (_p?: Params) => Promise.resolve(true);

const defaultValue = {
  confirmRef: {
    current: defaultFunction,
  },
};

const ModalContext = createContext(defaultValue);
const ModalControlContext = createContext<{ close: () => void } | undefined>(undefined);

function ModalControlContextProvider({
  children,
  close,
}: PropsWithChildren & { close: () => void }) {
  return <ModalControlContext.Provider value={{ close }}>{children}</ModalControlContext.Provider>;
}

export function ModalContextProvider({ children }: PropsWithChildren) {
  const confirmRef = useRef(defaultFunction);
  return (
    <ModalContext.Provider value={{ confirmRef }}>
      {children}
      {createPortal(<ModalWithContext />, document.body)}
    </ModalContext.Provider>
  );
}

function ModalWithContext() {
  const [open, setOpen] = useState(false);
  const [props, setProps] = useState<undefined | Params>();
  const resolveRef = useRef((_v: boolean) => {});
  const { confirmRef } = useContext(ModalContext);

  const onModal = useCallback(() => {
    resolveRef.current(true);
    setOpen(false);
  }, [resolveRef]);

  useEffect(() => {
    confirmRef.current = (props) =>
      new Promise((resolve) => {
        setProps(props);
        setOpen(true);
        resolveRef.current = resolve;
      });
  }, [confirmRef]);

  if (!open) return;

  return (
    <div className="fixed inset-0 flex bg-bg-dark/75 text-text" onClick={onModal}>
      <div className="m-auto" onClick={(e) => e.stopPropagation()}>
        <ModalControlContextProvider close={onModal}>{props}</ModalControlContextProvider>
      </div>
    </div>
  );
}

export function useModal() {
  const { confirmRef } = useContext(ModalContext);
  return {
    confirm: useCallback(
      (p: Params) => {
        return confirmRef.current(p);
      },
      [confirmRef],
    ),
  };
}

export function useModalControls() {
  const context = useContext(ModalControlContext);
  if (!context) throw new Error("useModalControls must be used inside ModalControlContext");
  return {
    close: context.close,
  };
}
