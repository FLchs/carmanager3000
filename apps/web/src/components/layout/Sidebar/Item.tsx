import { createLink, type LinkComponent } from "@tanstack/react-router";
import { type ReactNode, type RefObject } from "react";

interface ItemLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  label?: string;
  icon?: ReactNode;
}

const BasicLinkComponent = ({
  ref,
  icon,
  label,
  ...props
}: ItemLinkProps & { ref?: RefObject<HTMLAnchorElement | null> }) => {
  return (
    <li>
      <a
        ref={ref}
        {...props}
        className="flex w-full cursor-pointer flex-row items-center gap-4 rounded-lg p-2 text-left hover:bg-bg data-[status=active]:font-bold data-[status=active]:text-text"
      >
        <span className="shrink-0">{icon}</span>
        {label}
      </a>
    </li>
  );
};

const CreatedLinkComponent = createLink(BasicLinkComponent);

export const Item: LinkComponent<typeof BasicLinkComponent> = (props) => {
  return <CreatedLinkComponent preload={"intent"} {...props} />;
};
