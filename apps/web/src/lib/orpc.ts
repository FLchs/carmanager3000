import type { Client } from "@cm3k/server";

import { createORPCClient, onError } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";
import { QueryCache, QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      console.error(error);
    },
  }),
});

const link = new RPCLink({
  url: "http://localhost:3000/rpc",
  headers: () => ({
    authorization: "Bearer token",
  }),
  // fetch: <-- provide fetch polyfill fetch if needed
  // interceptors: [
  //   onError((error) => {
  //     console.log("#############");
  //     console.error(error);
  //   }),
  // ],
});

// Create a client for your router
export const client: Client = createORPCClient(link);
export const orpc = createTanstackQueryUtils(client);
