import { useCallback, useEffect, useRef } from "react";

export function useClickOutside(onClickOutside: () => void) {
  const ref = useRef<HTMLDivElement>(null);

  // Stable callback to avoid re-attaching listener
  const handler = useCallback(
    (event: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClickOutside();
      }
    },
    [onClickOutside],
  );

  useEffect(() => {
    document.addEventListener("pointerdown", handler);
    return () => document.removeEventListener("pointerdown", handler);
  }, [handler]);

  return ref;
}
