import { QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";

import "./index.css";
import { createRoot } from "react-dom/client";

import App from "./App.tsx";
import { queryClient } from "./lib/orpc.ts";

createRoot(document.querySelector("#root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
);
