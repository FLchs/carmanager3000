import { createLink, type LinkComponent } from "@tanstack/react-router";
import { type RefObject } from "react";

interface BasicLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  label?: string;
  // Add any additional props you want to pass to the anchor element
}

const BasicLinkComponent = ({
  ref,
  ...props
}: BasicLinkProps & { ref?: RefObject<HTMLAnchorElement | null> }) => {
  return (
    <a
      ref={ref}
      {...props}
      className={
        "[&[data-status=active]]:bg-bg-light text-text flex flex-row items-center gap-4 rounded-lg px-3 py-2 [&[data-status=active]]:font-bold"
      }
    />
  );
};

const CreatedLinkComponent = createLink(BasicLinkComponent);

export const SidebarItem: LinkComponent<typeof BasicLinkComponent> = (props) => {
  return <CreatedLinkComponent preload={"intent"} {...props} />;
};
