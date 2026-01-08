import { errorMiddleware } from "#middlewares/errorMiddleware";
import { os } from "@orpc/server";

import { operationsRouter } from "./operations";
import { vehiclesRouter } from "./vehicles";

export const router = os.use(errorMiddleware).router({
  operations: operationsRouter,
  vehicles: vehiclesRouter,
});
