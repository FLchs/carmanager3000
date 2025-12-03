
import type { ContractRouterClient } from '@orpc/contract'
import type { JsonifiedClient } from '@orpc/openapi-client'

import { vehiclesContract as contract } from '@cm3k/contract';
import { createORPCClient } from '@orpc/client'
import { OpenAPILink } from '@orpc/openapi-client/fetch'
import { createTanstackQueryUtils } from "@orpc/tanstack-query";
import { QueryCache, QueryClient } from "@tanstack/react-query";

const link = new OpenAPILink(contract, {
  url: "http://localhost:3000/api",
  headers: () => ({
    authorization: "Bearer token",
  }),
})

const client: JsonifiedClient<ContractRouterClient<typeof contract>> = createORPCClient(link)

export const openApiQueryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      console.error(error);
    },
  }),
});

export const openapi = createTanstackQueryUtils(client);
