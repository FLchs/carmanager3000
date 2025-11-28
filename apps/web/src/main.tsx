import { QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";

import "./index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { ConfirmProvider } from "./contexts/ConfirmContextProvider.tsx";
import { queryClient } from "./lib/orpc.ts";
// Import the generated route tree
import { routeTree } from "./routeTree.gen";

// Create a new router instance
const router = createRouter({
  // Since we're using React Query, we don't want loader calls to ever be stale
  // This will ensure that the loader is always called when the route is preloaded or visited
  defaultPreload: "intent",
  defaultPreloadStaleTime: 0,
  routeTree,
  scrollRestoration: true,
  context: {
    queryClient,
  },
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

createRoot(document.querySelector("#root")!).render(
  <StrictMode>
    <ConfirmProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ConfirmProvider>
  </StrictMode>,
);
