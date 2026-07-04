import { errorMiddleware } from "#middlewares/errorMiddleware";
import { os } from "@orpc/server";

import { documentsRouter } from "../modules/documents/router";
import { documentTypesRouter } from "../modules/document-types/router";
import { operationsRouter } from "../modules/operations/router";
import { vehiclesRouter } from "../modules/vehicles/router";

export const router = os.use(errorMiddleware).router({
  operations: operationsRouter,
  vehicles: vehiclesRouter,
  documents: documentsRouter,
  documentType: documentTypesRouter,
});
