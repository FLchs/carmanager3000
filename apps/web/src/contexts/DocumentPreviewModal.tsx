import { useCallback, useEffect, type PropsWithChildren } from "react";
import { ModalContextProvider, useModal, useModalControls } from "./ModalContext";
import { Preview } from "#/components/ui/Preview";

export function DocumentPreviewModalProvider({ children }: PropsWithChildren) {
  return <ModalContextProvider>{children}</ModalContextProvider>;
}

export function useDocumentPreviewModal() {
  const { confirm } = useModal();

  const openModal = useCallback(
    (url?: string | null) => {
      if (!url) return;
      confirm(<Wrapper url={url} />);
    },
    [confirm],
  );

  function Wrapper({ url }: { url: string }) {
    const { close } = useModalControls();

    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          close();
        }
      };
      document.addEventListener("keydown", handleKeyDown);
      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    }, [close]);

    return (
      <Preview
        url={`http://localhost:3000${url}`}
        onclose={() => {
          close();
        }}
      />
    );
  }

  return { openModal };
}
