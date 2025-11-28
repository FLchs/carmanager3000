import { type ReactNode } from "react";

export default function Content({ items }: { items: ReactNode[] }) {
  return (
    <div className="bg-bg border-border text-text-muted rounded border-1">
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
