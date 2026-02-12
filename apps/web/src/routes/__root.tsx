import type { QueryClient } from "@tanstack/react-query";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import Sidebar from "../components/layout/Sidebar";

const RootLayout = () => (
  <>
    <div className="flex flex-row">
      <Sidebar />
      <div className="p-4 text-text">
        <Outlet />
      </div>
    </div>
    <TanStackRouterDevtools position="bottom-right" />
    <ReactQueryDevtools />
  </>
);

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: RootLayout,
});
