import { useLayoutEffect } from "@tanstack/react-router";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export default function PopoverContent({
  anchorRef,
  children,
  onClose,
}: {
  anchorRef: React.RefObject<HTMLElement | null>;
  children: ReactNode;
  onClose: () => void;
}) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ left: number; top: number }>({
    left: 0,
    top: 0,
  });

  // Position logic — runs only when component mounts or dependencies change
  useLayoutEffect(() => {
    const anchor = anchorRef.current;
    const menu = menuRef.current;
    if (!anchor || !menu) return;

    const rect = anchor.getBoundingClientRect();
    const menuRect = menu.getBoundingClientRect();

    let left = rect.left;
    const top = rect.bottom + 4;

    if (left + menuRect.width > window.innerWidth) {
      left = window.innerWidth - menuRect.width - 4;
    }

    // eslint-disable-next-line @eslint-react/hooks-extra/no-direct-set-state-in-use-effect
    setPos({ left, top });
  }, [anchorRef]);

  // Click outside detection
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        !menuRef.current?.contains(e.target as Node) &&
        !anchorRef.current?.contains(e.target as Node)
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose, anchorRef]);

  return createPortal(
    <div
      style={{
        left: pos.left,
        position: "fixed",
        top: pos.top,
        zIndex: 1000,
      }}
      ref={menuRef}
    >
      {children}
    </div>,
    document.body,
  );
}
