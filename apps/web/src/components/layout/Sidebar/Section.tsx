import { ChevronRight } from "lucide-react";
import { useCallback, useContext, useState, type PropsWithChildren, type ReactNode } from "react";
import { SidebarContext } from "./Sidebar";

function Section({ icon, label, children }: PropsWithChildren<{ icon: ReactNode; label: string }>) {
  const [open, setOpen] = useState(false);
  const { collapsed, setCollapsed } = useContext(SidebarContext);

  const toggleOpen = useCallback(() => {
    if (collapsed) {
      setCollapsed(false);
      setOpen(true);
    } else {
      setOpen((v) => !v);
    }
  }, [setCollapsed, collapsed]);

  return (
    <>
      <button
        className="flex w-full cursor-pointer flex-row items-center gap-4 rounded-lg p-2 text-left hover:bg-bg data-[status=active]:text-text"
        onClick={toggleOpen}
      >
        <span className="shrink-0">{icon}</span>
        <span className="grow">{label}</span>
        <ChevronRight className={`transition-all ${open && "rotate-90"}`} />
      </button>

      <ul
        className={`${open && !collapsed ? "grid-rows-[1fr]" : "grid-rows-[0fr]"} grid pl-4 transition-all duration-300 ease-in`}
      >
        <div className="overflow-hidden">{children}</div>
      </ul>
    </>
  );
}

export default Section;
