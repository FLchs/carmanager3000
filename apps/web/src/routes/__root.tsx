import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

const RootLayout = () => (
  <>
    <div className="p-2 flex gap-2">
      <Link className="[&.active]:font-bold" to="/">
        Home
      </Link>
      <Link className="[&.active]:font-bold" to="/vehicles">
        Vehicles
      </Link>
    </div>
    <hr />
    <Outlet />
    <TanStackRouterDevtools />
    <ReactQueryDevtools />
  </>
);

export const Route = createRootRoute({ component: RootLayout });
