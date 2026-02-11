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
      className="w-full rounded-lg px-2 py-1 text-text data-[status=active]:bg-bg-light data-[status=active]:font-bold"
    />
  );
};

const CreatedLinkComponent = createLink(BasicLinkComponent);

export const SidebarSectionItem: LinkComponent<typeof BasicLinkComponent> = (props) => {
  return <CreatedLinkComponent preload={"intent"} {...props} />;
};
