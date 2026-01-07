import { os } from "@orpc/server";

import { operationsRouter } from "./operations";
import { vehiclesRouter } from "./vehicles";

export const router = os.router({
  operations: operationsRouter,
  vehicles: vehiclesRouter,
});
