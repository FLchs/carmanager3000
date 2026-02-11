import { useMatches, Link } from "@tanstack/react-router";
import { ChevronRightIcon } from "lucide-react";

function Breadcrumbs() {
  const matches = useMatches();
  return (
    <nav className="flex">
      <ol className="inline-flex items-center space-x-1">
        <li className="inline-flex items-center">
          <Link
            to="/"
            className="inline-flex items-center text-sm font-medium text-text-muted hover:text-text"
          >
            Home
          </Link>
        </li>
        {matches
          .filter((m) => m.staticData?.getTitle)
          .map((m) => (
            <li key={m.id}>
              <div className="flex items-center space-x-1.5">
                <ChevronRightIcon size={16} />
                <Link
                  activeOptions={{ exact: true }}
                  to={m.pathname}
                  className="inline-flex items-center text-sm text-text-muted hover:text-text data-[status=active]:pointer-events-none data-[status=active]:font-bold data-[status=active]:hover:text-text-muted"
                >
                  {m.staticData.getTitle?.()}
                </Link>
              </div>
            </li>
          ))}
      </ol>
    </nav>
  );
}

export default Breadcrumbs;
