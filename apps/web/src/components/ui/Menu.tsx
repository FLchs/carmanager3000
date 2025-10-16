import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

export default function Menu({ items }: { items: ReactNode[] }) {
  return (
    <div className="relative inline-block">
      <button
        className="text-text-muted hover:text-white cursor-pointer"
        onClick={() => {}}
        type="button"
      >
        ⠇
      </button>

      {items.map((item) => (
        <div
          className="hover:bg-bg-light px-4 py-2 cursor-pointer hover:text-text"
          key={Math.random()}
        >
          {item}
        </div>
      ))}
    </div>
  );
}
