import type { ReactNode } from "react";

function InfoCard({ children }: { children: ReactNode }) {
  return (
    <div className="bg-bg border-1 rounded-lg border-border py-2 px-4 ">
      <dl className="grid grid-cols-2 gap-2">{children}</dl>
    </div>
  );
}

export default InfoCard;
