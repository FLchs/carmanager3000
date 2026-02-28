import { ChevronRight } from "lucide-react";
import {
  useCallback,
  useContext,
  useEffect,
  useState,
  type AnchorHTMLAttributes,
  type MouseEvent,
  type PropsWithChildren,
  type ReactNode,
} from "react";
import { SidebarContext } from "./Sidebar";
import { createLink, type LinkComponent } from "@tanstack/react-router";
import { type RefObject } from "react";

interface CollapsibleSectionContentProps extends PropsWithChildren<AnchorHTMLAttributes<HTMLAnchorElement>> {
  label?: string;
  icon?: ReactNode;
}

const CollapsibleSectionContent = ({
  ref,
  icon,
  label,
  children,
  onClick,
  ...props
}: CollapsibleSectionContentProps & { ref?: RefObject<HTMLAnchorElement | null> }) => {
  const [open, setOpen] = useState(false);
  const { collapsed, toggleCollapse } = useContext(SidebarContext);

  const toggleOpen = useCallback(() => {
    setOpen((isOpen) => !isOpen);
  }, []);

  const handleSectionClick = useCallback(
    (e: MouseEvent<HTMLAnchorElement>) => {
      if (onClick != null) {
        onClick(e);
      }
      if (collapsed) {
        toggleCollapse();
      }
      setOpen(true);
    },
    [onClick, toggleCollapse, collapsed],
  );

  useEffect(() => {
    if (collapsed) {
      setOpen(false);
    }
  }, [collapsed]);

  return (
    <>
      <div className="flex w-full cursor-pointer flex-row items-center gap-4 text-left data-[status=active]:text-text">
        <a
          ref={ref}
          {...props}
          onClick={handleSectionClick}
          className="flex w-full flex-row items-center gap-4 rounded-lg p-2 hover:bg-bg data-[status=active]:text-text"
        >
          <span className="shrink-0">{icon}</span>
          <span className="grow">{label}</span>
        </a>
        <ChevronRight
          className={`transition-all hover:text-text ${open && "rotate-90"}`}
          onClick={toggleOpen}
        />
      </div>

      <ul
        className={`${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"} grid pl-4 transition-all duration-300 ease-in`}
      >
        <div className="overflow-hidden">{children}</div>
      </ul>
    </>
  );
};

const LinkedSectionContent = createLink(CollapsibleSectionContent);

export const SectionItem: LinkComponent<typeof CollapsibleSectionContent> = (props) => {
  return <LinkedSectionContent preload={"intent"} {...props} />;
};
