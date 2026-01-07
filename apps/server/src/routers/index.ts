import { errorMiddleWare } from "#middlewares/errorMiddleWare";
import { os } from "@orpc/server";

import { operationsRouter } from "./operations";
import { vehiclesRouter } from "./vehicles";

export const router = os.use(errorMiddleWare).router({
  operations: operationsRouter,
  vehicles: vehiclesRouter,
});
