import { type ReactNode } from "react";

export default function Content({ items }: { items: ReactNode[] }) {
  return (
    <div className="bg-bg border-border border-1 rounded text-text-muted">
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
