import type { ReactNode } from "react";
import Breadcrumbs from "./Breadcrumbs";

function Header({ children, action }: { children?: ReactNode; action?: ReactNode }) {
  return (
    <header>
      <div className="flex flex-row items-start justify-between">
        <Breadcrumbs />
        {action}
      </div>
      <div className="mt-2">{children}</div>
    </header>
  );
}

export default Header;
