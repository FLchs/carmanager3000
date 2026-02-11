import { ChevronDownIcon, ChevronRightIcon } from "lucide-react";
import { useState, type ReactNode } from "react";

function SidebarSection({
  children,
  item,
  className,
}: {
  children: ReactNode;
  item: ReactNode;
  className?: HTMLDivElement["className"];
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className={className}>
      <div
        className={`flex flex-row items-center gap-4 rounded-lg ${open && ""} cursor-pointer px-3 py-2 text-text`}
        onClick={() => setOpen((v) => !v)}
      >
        {item} {open ? <ChevronDownIcon size={18} /> : <ChevronRightIcon size={18} />}
      </div>
      {open && (
        <div className="ml-5 flex flex-col gap-2 border-l-2 border-border pt-2 pl-2">
          {children}
        </div>
      )}
    </div>
  );
}

export default SidebarSection;
