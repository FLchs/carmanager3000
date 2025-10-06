import type { Client } from "@cm3k/server";

import { createORPCClient, onError } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";

const link = new RPCLink({
  headers: () => ({
    authorization: "Bearer token",
  }),
  // fetch: <-- provide fetch polyfill fetch if needed
  interceptors: [
    onError((error) => {
      console.error(error);
    }),
  ],
  url: "http://localhost:3000/rpc",
});

// Create a client for your router
export const client: Client = createORPCClient(link);
export const orpc = createTanstackQueryUtils(client);
