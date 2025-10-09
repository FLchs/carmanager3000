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
        "block px-3 py-2 [&[data-status=active]]:font-bold [&[data-status=active]]:bg-surface rounded-lg"
      }
    />
  );
};

const CreatedLinkComponent = createLink(BasicLinkComponent);

export const SidebarItem: LinkComponent<typeof BasicLinkComponent> = (
  props,
) => {
  return <CreatedLinkComponent preload={"intent"} {...props} />;
};
