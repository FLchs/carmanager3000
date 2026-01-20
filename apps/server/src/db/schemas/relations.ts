import { defineRelations } from "drizzle-orm";

import { documents } from "./documents";
import { operations } from "./operations";
import { vehicles } from "./vehicle";

export const relations = defineRelations({ operations, vehicles, documents }, (r) => ({
  operations: {
    vehicles: r.one.vehicles({
      from: r.operations.vehicleId,
      to: r.vehicles.id,
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
}));
