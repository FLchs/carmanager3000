import { defineRelations } from "drizzle-orm";

import { operations } from "./operations";
import { vehicles } from "./vehicle";

export const relations = defineRelations({ operations, vehicles }, (r) => ({
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
  },
}));
