import {
  type PropsWithChildren,
  use,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Dialog from "@/components/ui/Dialog";

import { ConfirmContext, defaultFunction, type Props } from "./ConfirmContext";

export function ConfirmProvider({ children }: PropsWithChildren) {
  const value = useMemo(() => {
    return { confirmRef: { current: defaultFunction } };
  }, []);

  return (
    <ConfirmContext value={value}>
      {children}
      <ConfirmDialogWithContext />
    </ConfirmContext>
  );
}

function ConfirmDialogWithContext() {
  const resolveRef = useRef<(_v: boolean) => void>(null);
  const { confirmRef } = use(ConfirmContext);

  const [title, setTitle] = useState<string>("");

  const dialogRef = useRef<HTMLDialogElement>(null);

  confirmRef.current = (params?: Props) =>
    new Promise((resolve) => {
      setTitle(params?.title ?? "Are you sure ?");
      dialogRef.current?.showModal();
      resolveRef.current = resolve;
    });

  const onConfirm = useCallback(() => {
    resolveRef.current?.(true);
    dialogRef.current?.close();
  }, []);

  const onCancel = useCallback(() => {
    resolveRef.current?.(false);
    dialogRef.current?.close();
  }, []);

  return createPortal(
    <Dialog
      onCancel={onCancel}
      onConfirm={onConfirm}
      ref={dialogRef}
      title={title}
    />,
    document.body,
  );
}
