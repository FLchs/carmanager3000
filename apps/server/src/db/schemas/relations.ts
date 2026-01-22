import { defineRelations } from "drizzle-orm";

import { documents } from "./documents";
import { documentsTypes } from "./documentsTypes";
import { operations } from "./operations";
import { vehicles } from "./vehicle";

export const relations = defineRelations(
  { operations, vehicles, documents, documentsTypes },
  (r) => ({
    operations: {
      vehicles: r.one.vehicles({
        from: r.operations.vehicleId,
        to: r.vehicles.id,
      }),
    },
    documents: {
      type: r.one.documentsTypes({
        from: r.documents.typeId,
        to: r.documentsTypes.id,
      }),
    },
    vehicles: {
      operations: r.many.operations({
        from: r.vehicles.id,
        to: r.operations.vehicleId,
      }),
      documents: r.many.documents({
        from: r.vehicles.id,
        to: r.documents.entityId,
        where: {
          entityType: "vehicle",
        },
      }),
    },
  }),
);
