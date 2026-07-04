import Main from "#/components/layout/Main";
import Sidebar from "#/components/layout/Sidebar/Sidebar";
import type { QueryClient } from "@tanstack/react-query";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRootRouteWithContext } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

const RootLayout = () => (
  <>
    <div className="flex flex-row">
      <Sidebar />
      <Main />
    </div>
    <TanStackRouterDevtools position="bottom-right" />
    <ReactQueryDevtools />
  </>
);

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: RootLayout,
});
