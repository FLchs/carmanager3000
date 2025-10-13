import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import Sidebar from "../components/ui/sidebar/Sidebar";

const RootLayout = () => (
  <>
    <div className="flex flex-row">
      <Sidebar />
      <Outlet />
    </div>
    <TanStackRouterDevtools />
    <ReactQueryDevtools />
  </>
);

export const Route = createRootRoute({ component: RootLayout });
