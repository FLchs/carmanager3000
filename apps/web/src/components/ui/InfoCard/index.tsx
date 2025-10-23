import type { ReactNode } from "react";

function InfoCard({ children }: { children: ReactNode }) {
  return (
    <div className="bg-bg border-border rounded-lg border-1 px-4 py-2">
      <dl className="grid grid-cols-2 gap-2">{children}</dl>
    </div>
  );
}

export default InfoCard;
