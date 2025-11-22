import { relations } from "drizzle-orm";

import { operations } from "./operations";
import { vehicles } from "./vehicle";

export const vehicleRelations = relations(vehicles, ({ many }) => ({
  operations: many(operations),
}));

export const operationsRelations = relations(operations, ({ one }) => ({
  vehicle: one(vehicles, {
    fields: [operations.vehicleId],
    references: [vehicles.id],
  }),
}));
