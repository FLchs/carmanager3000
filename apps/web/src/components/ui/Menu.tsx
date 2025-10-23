import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

export default function Menu({ items }: { items: ReactNode[] }) {
  return (
    <div className="relative inline-block">
      <button
        className="text-text-muted cursor-pointer hover:text-white"
        onClick={() => {}}
        type="button"
      >
        ⠇
      </button>

      {items.map((item) => (
        <div
          className="hover:bg-bg-light hover:text-text cursor-pointer px-4 py-2"
          key={Math.random()}
        >
          {item}
        </div>
      ))}
    </div>
  );
}
