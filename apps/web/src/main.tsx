import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";

import "./index.css";
import { createRoot } from "react-dom/client";

import App from "./App.tsx";

// Create a client
const queryClient = new QueryClient();

createRoot(document.querySelector("#root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
);
