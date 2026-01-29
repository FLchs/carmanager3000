import { errorMiddleware } from "#middlewares/errorMiddleware";
import { os } from "@orpc/server";

import { documentsRouter } from "./documents";
import { documentTypesRouter } from "./documentTypes";
import { operationsRouter } from "./operations";
import { vehiclesRouter } from "./vehicles";

export const router = os.use(errorMiddleware).router({
  operations: operationsRouter,
  vehicles: vehiclesRouter,
  documents: documentsRouter,
  documentType: documentTypesRouter,
});
