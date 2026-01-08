import { NotFoundError } from "#lib/errors";
import { errorMiddleware } from "#middlewares/errorMiddleware";
import { onError, ORPCError, os } from "@orpc/server";

import { operationsRouter } from "./operations";
import { vehiclesRouter } from "./vehicles";

export const router = os
  // .use(
  //   onError((err) => {
  //     console.log(err);
  //     if (err instanceof NotFoundError) {
  //       throw new ORPCError("TOO_MANY_REQUESTS");
  //     }
  //   }),
  // )
  .use(errorMiddleware)
  .router({
    operations: operationsRouter,
    vehicles: vehiclesRouter,
  });
